"""
Import the Ford Ranger OBJ, retarget materials for the KYRA wrap simulator,
and export Draco GLB.

Usage:
  blender --factory-startup --background --python "3d models/export_ford_ranger.py"
"""
from __future__ import annotations

from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(r"d:\kyra")
OBJ = ROOT / "3d models" / "FRD RANGER" / "extracted" / "ford ranger.obj"
TEX_DIR = ROOT / "3d models" / "FRD RANGER" / "textures"
OUT = ROOT / "public" / "models" / "ford_ranger.glb"

# Factory-like Carbonized Gray — only visible for Clear PPF (wrap replaces paint).
PAINT_COLOR = (0.22, 0.24, 0.26, 1.0)


def principled(mat: bpy.types.Material):
    mat.use_nodes = True
    tree = mat.node_tree
    tree.nodes.clear()
    node = tree.nodes.new("ShaderNodeBsdfPrincipled")
    node.location = (0, 0)
    out = tree.nodes.new("ShaderNodeOutputMaterial")
    out.location = (320, 0)
    tree.links.new(node.outputs["BSDF"], out.inputs["Surface"])
    return node


def set_input(node, name, value):
    sock = node.inputs.get(name)
    if sock is not None:
        sock.default_value = value


def load_image(filename: str, colorspace: str):
    path = TEX_DIR / filename
    if not path.exists():
        print(f"[KYRA] Missing texture {path}")
        return None
    img = bpy.data.images.load(str(path), check_existing=True)
    img.pack()
    if hasattr(img, "colorspace_settings"):
        img.colorspace_settings.name = colorspace
    return img


def mix_color_with_texture(mat, bsdf, image, color, multiply=True):
    if image is None:
        set_input(bsdf, "Base Color", color)
        return
    tree = mat.node_tree
    tex = tree.nodes.new("ShaderNodeTexImage")
    tex.image = image
    tex.location = (-560, 80)
    mix = tree.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.blend_type = "MULTIPLY" if multiply else "MIX"
    mix.location = (-220, 80)
    set_input(mix, "Factor", 1.0)
    # Blender 4+/5 Mix Color sockets
    a = mix.inputs.get("A") or mix.inputs.get("Color1")
    b = mix.inputs.get("B") or mix.inputs.get("Color2")
    if a is not None:
        a.default_value = color
    if b is not None:
        tree.links.new(tex.outputs["Color"], b)
    tree.links.new(mix.outputs.get("Result") or mix.outputs[2], bsdf.inputs["Base Color"])


def connect_base_color(mat, bsdf, image, color):
    if image is None:
        set_input(bsdf, "Base Color", color)
        return
    tree = mat.node_tree
    tex = tree.nodes.new("ShaderNodeTexImage")
    tex.image = image
    tex.location = (-360, 80)
    tree.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    set_input(bsdf, "Base Color", color)


def connect_normal(mat, bsdf, image, strength=1.0):
    if image is None:
        return
    tree = mat.node_tree
    tex = tree.nodes.new("ShaderNodeTexImage")
    tex.image = image
    tex.location = (-560, -220)
    nrm = tree.nodes.new("ShaderNodeNormalMap")
    nrm.location = (-240, -220)
    nrm.inputs["Strength"].default_value = strength
    tree.links.new(tex.outputs["Color"], nrm.inputs["Color"])
    tree.links.new(nrm.outputs["Normal"], bsdf.inputs["Normal"])


def opaque(mat):
    mat.blend_method = "OPAQUE"
    if hasattr(mat, "shadow_method"):
        mat.shadow_method = "OPAQUE"


def hashed_blend(mat):
    # Blender 5: BLEND / HASHED / CLIP
    if "HASHED" in mat.bl_rna.properties["blend_method"].enum_items.keys():
        mat.blend_method = "HASHED"
    else:
        mat.blend_method = "BLEND"


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.cameras, bpy.data.lights):
        for item in list(coll):
            coll.remove(item)


def import_obj():
    print(f"[KYRA] Import {OBJ}")
    bpy.ops.wm.obj_import(filepath=str(OBJ))


def world_size(obj):
    xs, ys, zs = [], [], []
    for corner in obj.bound_box:
        v = obj.matrix_world @ Vector(corner)
        xs.append(v.x)
        ys.append(v.y)
        zs.append(v.z)
    return (max(xs) - min(xs), max(ys) - min(ys), max(zs) - min(zs))


def hide_bogus_glass_volumes():
    """Headlight glass is compact; giant clearglass shells are leftover volumes."""
    for obj in list(bpy.context.scene.objects):
        if obj.type != "MESH":
            continue
        mats = [s.material.name.lower() if s.material else "" for s in obj.material_slots]
        if not any("clearglass" in name for name in mats):
            continue
        sx, sy, sz = world_size(obj)
        dims = sorted((sx, sy, sz), reverse=True)
        if dims[0] > 1.2 and dims[1] > 1.2:
            print(f"[KYRA] Remove oversized glass volume {obj.name} size={sx:.2f}x{sy:.2f}x{sz:.2f}")
            bpy.data.objects.remove(obj, do_unlink=True)


def reassign_large_plastic_to_paint():
    """Material__27 is mixed: thin bed/trim stays plastic; bulky bumper-like shells get paint."""
    paint = bpy.data.materials.get("carpaint")
    if paint is None:
        return
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH":
            continue
        for slot in obj.material_slots:
            if slot.material and slot.material.name == "Material__27":
                sx, sy, sz = world_size(obj)
                thickness = min(sx, sy, sz)
                if thickness > 0.2:
                    print(f"[KYRA] {obj.name} Material__27 -> carpaint (body-sized)")
                    slot.material = paint


def rebuild_materials():
    body_ao = load_image("body_rangersp.png", "Non-Color")
    wheel_diff = load_image("wheel_B.png", "sRGB")
    wheel_nm = load_image("wheel_B_NM.png", "Non-Color")

    for mat in bpy.data.materials:
        name = mat.name.lower()
        bsdf = principled(mat)
        opaque(mat)
        set_input(bsdf, "Metallic", 0.0)
        set_input(bsdf, "Roughness", 0.48)
        set_input(bsdf, "Coat Weight", 0.0)
        set_input(bsdf, "Transmission Weight", 0.0)
        set_input(bsdf, "Alpha", 1.0)
        set_input(bsdf, "IOR", 1.45)
        set_input(bsdf, "Emission Strength", 0.0)

        if name == "carpaint":
            mix_color_with_texture(mat, bsdf, body_ao, PAINT_COLOR)
            set_input(bsdf, "Metallic", 0.14)
            set_input(bsdf, "Roughness", 0.22)
            set_input(bsdf, "Coat Weight", 1.0)
            set_input(bsdf, "Coat Roughness", 0.04)
            continue

        if name == "windows_glass":
            set_input(bsdf, "Base Color", (0.03, 0.04, 0.05, 1.0))
            set_input(bsdf, "Roughness", 0.06)
            set_input(bsdf, "Metallic", 0.0)
            set_input(bsdf, "Transmission Weight", 0.88)
            set_input(bsdf, "Alpha", 0.28)
            hashed_blend(mat)
            continue

        if name == "clearglass":
            set_input(bsdf, "Base Color", (0.92, 0.95, 0.98, 1.0))
            set_input(bsdf, "Roughness", 0.05)
            set_input(bsdf, "Transmission Weight", 0.2)
            set_input(bsdf, "Alpha", 0.32)
            hashed_blend(mat)
            continue

        if name == "redglass":
            set_input(bsdf, "Base Color", (0.72, 0.05, 0.05, 1.0))
            set_input(bsdf, "Roughness", 0.1)
            set_input(bsdf, "Transmission Weight", 0.15)
            set_input(bsdf, "Alpha", 0.5)
            hashed_blend(mat)
            continue

        if name == "chrome":
            set_input(bsdf, "Base Color", (0.82, 0.84, 0.86, 1.0))
            set_input(bsdf, "Metallic", 1.0)
            set_input(bsdf, "Roughness", 0.12)
            continue

        if name in {"black_rim", "material__34"}:
            set_input(bsdf, "Base Color", (0.08, 0.08, 0.09, 1.0))
            set_input(bsdf, "Metallic", 0.72)
            set_input(bsdf, "Roughness", 0.28)
            continue

        if name == "tyre":
            connect_base_color(mat, bsdf, wheel_diff, (0.04, 0.04, 0.04, 1.0))
            connect_normal(mat, bsdf, wheel_nm, 0.85)
            set_input(bsdf, "Metallic", 0.0)
            set_input(bsdf, "Roughness", 0.72)
            continue

        if name == "disc":
            set_input(bsdf, "Base Color", (0.35, 0.35, 0.36, 1.0))
            set_input(bsdf, "Metallic", 0.8)
            set_input(bsdf, "Roughness", 0.32)
            continue

        if name == "interior":
            set_input(bsdf, "Base Color", (0.07, 0.07, 0.08, 1.0))
            set_input(bsdf, "Metallic", 0.0)
            set_input(bsdf, "Roughness", 0.78)
            continue

        if name == "mirror":
            set_input(bsdf, "Base Color", (0.55, 0.58, 0.62, 1.0))
            set_input(bsdf, "Metallic", 1.0)
            set_input(bsdf, "Roughness", 0.04)
            continue

        if name == "black_gloss":
            set_input(bsdf, "Base Color", (0.02, 0.02, 0.025, 1.0))
            set_input(bsdf, "Metallic", 0.2)
            set_input(bsdf, "Roughness", 0.18)
            set_input(bsdf, "Coat Weight", 0.8)
            continue

        if name == "red":
            set_input(bsdf, "Base Color", (0.55, 0.02, 0.02, 1.0))
            set_input(bsdf, "Emission Color", (0.8, 0.05, 0.05, 1.0))
            set_input(bsdf, "Emission Strength", 0.35)
            set_input(bsdf, "Roughness", 0.35)
            continue

        if name.startswith("material__"):
            set_input(bsdf, "Base Color", (0.06, 0.06, 0.065, 1.0))
            set_input(bsdf, "Metallic", 0.08)
            set_input(bsdf, "Roughness", 0.55)
            continue

        if name == "black":
            set_input(bsdf, "Base Color", (0.03, 0.03, 0.035, 1.0))
            set_input(bsdf, "Metallic", 0.05)
            set_input(bsdf, "Roughness", 0.52)
            continue


def rename_materials():
    mapping = {
        "carpaint": "CarPaint",
        "windows_glass": "windows_glass",
        "clearglass": "GlassWhite",
        "redglass": "GlassRed",
        "chrome": "Chrome",
        "black": "PlasticBlack",
        "black_rim": "Rim",
        "black_gloss": "PlasticGloss",
        "tyre": "Tire",
        "disc": "BrakeDisc",
        "interior": "Interior",
        "mirror": "Mirror",
        "red": "TailLight",
        "Material__27": "Cladding",
        "Material__29": "BodyTrim",
        "Material__31": "BumperPlastic",
        "Material__32": "Mechanical",
        "Material__34": "RimFace",
    }
    for mat in bpy.data.materials:
        target = mapping.get(mat.name, mapping.get(mat.name.lower()))
        if target and mat.name != target:
            print(f"[KYRA] Rename {mat.name} -> {target}")
            mat.name = target


def apply_transforms():
    mesh_objs = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    bpy.ops.object.select_all(action="DESELECT")
    for obj in mesh_objs:
        obj.hide_set(False)
        obj.hide_viewport = False
        obj.select_set(True)
    if mesh_objs:
        bpy.context.view_layer.objects.active = mesh_objs[0]
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)


def report_bounds():
    xs, ys, zs = [], [], []
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH":
            continue
        for corner in obj.bound_box:
            v = obj.matrix_world @ Vector(corner)
            xs.append(v.x)
            ys.append(v.y)
            zs.append(v.z)
    if not xs:
        return
    print(
        f"[KYRA] Bounds x={min(xs):.3f}:{max(xs):.3f} "
        f"y={min(ys):.3f}:{max(ys):.3f} z={min(zs):.3f}:{max(zs):.3f} "
        f"span=({max(xs)-min(xs):.3f}, {max(ys)-min(ys):.3f}, {max(zs)-min(zs):.3f})"
    )


def export_glb():
    mesh_objs = [o for o in bpy.context.scene.objects if o.type == "MESH" and o.visible_get()]
    bpy.ops.object.select_all(action="DESELECT")
    for obj in mesh_objs:
        obj.select_set(True)
    if mesh_objs:
        bpy.context.view_layer.objects.active = mesh_objs[0]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    kwargs = dict(
        filepath=str(OUT),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_texcoords=True,
        export_normals=True,
        export_materials="EXPORT",
        export_cameras=False,
        export_lights=False,
        export_animations=False,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
    )
    try:
        bpy.ops.export_scene.gltf(**kwargs)
    except TypeError as err:
        print(f"[KYRA] glTF kwargs fallback: {err}")
        bpy.ops.export_scene.gltf(filepath=str(OUT), export_format="GLB", use_selection=True)
    print(f"[KYRA] Exported {OUT} ({OUT.stat().st_size} bytes)")


def main():
    print(f"[KYRA] Textures: {TEX_DIR} exists={TEX_DIR.exists()}")
    clear_scene()
    import_obj()
    hide_bogus_glass_volumes()
    reassign_large_plastic_to_paint()
    rebuild_materials()
    rename_materials()
    apply_transforms()
    report_bounds()
    export_glb()


if __name__ == "__main__":
    main()
