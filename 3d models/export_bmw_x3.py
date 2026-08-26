"""
Import the BMW X3 FBX, retarget materials for the KYRA wrap simulator,
and export an original-quality GLB (no Draco, no texture recompress).

Usage:
  blender --factory-startup --background --python "3d models/export_bmw_x3.py"
"""
from __future__ import annotations

from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(r"d:\kyra")
FBX = ROOT / "3d models" / "BMW X3" / "extracted" / "FINAL_MODEL_22.fbx"
TEX_DIR = ROOT / "3d models" / "BMW X3" / "extracted"
OUT = ROOT / "public" / "models" / "bmw_x3.glb"

# FBX landed in ~cm/100; *100 puts length near a real X3 (~4.7m).
WORLD_SCALE = 100.0

PAINT_COLOR = (0.112, 0.112, 0.112, 1.0)

TEXTURE_FILES = {
    "back_lights": "_Baked_Back_lights_texture (Base Color).png",
    "backdoor": "_Baked_BackDoor_map (Base Color).png",
    "backseat": "_Baked_BackSeat_map (Base Color).png",
    "emblema": "_Baked_Emblema (Base Color).png",
    "frontdoor": "_Baked_FrontDoor_map (Base Color).png",
    "frontseat": "_Baked_FrontSeat_map (Base Color).png",
    "nomera": "_Baked_Nomera (Base Color).png",
    "potolok": "_Baked_Potolok_map (Base Color).png",
    "sidestoyka": "_Baked_SideStoyka_map (Base Color).png",
    "tonel": "_Baked_Tonel_map (Base Color).png",
    "torpeda": "_Baked_Torpeda_map (Base Color).png",
    "mlogo": "e14b7d8afc2df141b7b3c29215efed40.png",
}


def principled(mat: bpy.types.Material):
    mat.use_nodes = True
    tree = mat.node_tree
    node = next((n for n in tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if node is None:
        tree.nodes.clear()
        node = tree.nodes.new("ShaderNodeBsdfPrincipled")
        out = tree.nodes.new("ShaderNodeOutputMaterial")
        tree.links.new(node.outputs["BSDF"], out.inputs["Surface"])
    return node


def set_input(node, name, value):
    sock = node.inputs.get(name)
    if sock is not None:
        sock.default_value = value


def hashed_blend(mat):
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


def import_fbx():
    print(f"[KYRA] Import {FBX}")
    bpy.ops.import_scene.fbx(
        filepath=str(FBX),
        automatic_bone_orientation=True,
        use_custom_normals=True,
        ignore_leaf_bones=True,
    )


def scale_to_meters():
    mesh_objs = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    bpy.ops.object.select_all(action="DESELECT")
    for obj in mesh_objs:
        obj.hide_set(False)
        obj.hide_viewport = False
        obj.select_set(True)
        obj.scale = tuple(s * WORLD_SCALE for s in obj.scale)
    if mesh_objs:
        bpy.context.view_layer.objects.active = mesh_objs[0]
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)


def compact(name: str) -> str:
    return "".join(ch for ch in name.lower() if ch.isalnum())


def load_original_image(filename: str):
    path = TEX_DIR / filename
    if not path.exists():
        print(f"[KYRA] Missing texture {path}")
        return None
    img = bpy.data.images.load(str(path), check_existing=True)
    img.pack()
    return img


def replace_material_images(mat, image):
    if image is None or not mat.use_nodes or not mat.node_tree:
        return
    for node in mat.node_tree.nodes:
        if node.type == "TEX_IMAGE":
            node.image = image


def restore_original_textures():
    for mat in bpy.data.materials:
        key = compact(mat.name)
        tex_key = None
        for token, filename in TEXTURE_FILES.items():
            if compact(token) in key:
                tex_key = filename
                break
        if tex_key is None and "phong1badges" in key:
            tex_key = TEXTURE_FILES["mlogo"]
        if tex_key:
            img = load_original_image(tex_key)
            replace_material_images(mat, img)
            print(f"[KYRA] Texture {mat.name} <- {tex_key} size={tuple(img.size) if img else None}")


def tune_materials():
    for mat in bpy.data.materials:
        key = compact(mat.name)
        bsdf = principled(mat)

        if "carpaint" in key:
            set_input(bsdf, "Base Color", PAINT_COLOR)
            set_input(bsdf, "Metallic", 0.14)
            set_input(bsdf, "Roughness", 0.22)
            set_input(bsdf, "Coat Weight", 1.0)
            set_input(bsdf, "Coat Roughness", 0.04)
            mat.blend_method = "OPAQUE"
            continue

        if key in {"glass", "bmwglassb"} or key.endswith("glasswindows1"):
            set_input(bsdf, "Base Color", (0.03, 0.04, 0.05, 1.0))
            set_input(bsdf, "Roughness", 0.06)
            set_input(bsdf, "Metallic", 0.0)
            set_input(bsdf, "Transmission Weight", 0.88)
            set_input(bsdf, "Alpha", 0.28)
            hashed_blend(mat)
            continue

        if "glassfrontlights" in key or key == "glasslight":
            set_input(bsdf, "Base Color", (0.92, 0.95, 0.98, 1.0))
            set_input(bsdf, "Roughness", 0.05)
            set_input(bsdf, "Transmission Weight", 0.2)
            set_input(bsdf, "Alpha", 0.32)
            hashed_blend(mat)
            continue

        if "redglass" in key:
            set_input(bsdf, "Base Color", (0.72, 0.05, 0.05, 1.0))
            set_input(bsdf, "Roughness", 0.1)
            set_input(bsdf, "Transmission Weight", 0.15)
            set_input(bsdf, "Alpha", 0.5)
            hashed_blend(mat)
            continue

        if "chromelight" in key:
            set_input(bsdf, "Base Color", (0.82, 0.84, 0.86, 1.0))
            set_input(bsdf, "Metallic", 1.0)
            set_input(bsdf, "Roughness", 0.12)
            continue

        if "plastics" in key or "glasssurr" in key:
            set_input(bsdf, "Metallic", 0.05)
            set_input(bsdf, "Roughness", 0.52)
            set_input(bsdf, "Alpha", 1.0)
            mat.blend_method = "OPAQUE"
            continue

        if "chasssi" in key or "chassis" in key:
            set_input(bsdf, "Base Color", (0.02, 0.02, 0.02, 1.0))
            set_input(bsdf, "Metallic", 0.1)
            set_input(bsdf, "Roughness", 0.65)
            continue

        if "tire" in key:
            set_input(bsdf, "Base Color", (0.03, 0.03, 0.03, 1.0))
            set_input(bsdf, "Metallic", 0.0)
            set_input(bsdf, "Roughness", 0.78)
            continue

        if "rimcol" in key:
            set_input(bsdf, "Base Color", (0.08, 0.08, 0.09, 1.0))
            set_input(bsdf, "Metallic", 0.72)
            set_input(bsdf, "Roughness", 0.28)
            continue


def rename_materials():
    mapping = {
        "BMW:carPaint": "CarPaint",
        "glass": "windows_glass",
        "BMW:glass_B": "windows_glass",
        "glass_light": "GlassWhite",
        "BMW:Glass_front_lights1": "GlassWhite",
        "BMW:red_glass": "GlassRed",
        "BMW:plastic_S": "PlasticBlack",
        "BMW:glass_surr": "InteriorSurround",
        "BMW:chrome_light": "Chrome",
        "BMW:chasssi": "Chassis",
        "BMW:_Tire_mat_texture1": "Tire",
        "BMW:rimCol_2": "Rim",
        "BMW:caliper": "Caliper",
        "BMW:phong1badges": "Badge",
        "BMW:Mirrors_color1": "Mirror",
        "BMW:light": "Light",
        "BMW:Light_Black": "LampHousing",
        "BMW:blue_light": "HeadlightGlow",
        "BMW:Back_lights_emissive_color_02": "TailLight",
        "BMW:Front_lights_Spec1": "HeadlightSpec",
        "BMW:metal_D": "MetalTrim",
        "BMW:Koleso_tormoz_disk_mat__2": "BrakeDisc",
        "BMW:_Baked_FrontDoor_map1": "InteriorFrontDoor",
        "BMW:_Baked_BackDoor_map1": "InteriorBackDoor",
        "BMW:_Baked_FrontSeat_map1": "InteriorFrontSeat",
        "BMW:_Baked_BackSeat_map1": "InteriorBackSeat",
        "BMW:_Baked_Potolok_map1": "InteriorHeadliner",
        "BMW:_Baked_Tonel_map1": "InteriorTunnel",
        "BMW:_Baked_Torpeda_map1": "InteriorDash",
        "BMW:_Baked_SideStoyka_map1": "InteriorPillar",
        "BMW:_Baked_Emblema1": "Emblem",
        "BMW:_Baked_Nomera1": "NumberPlate",
        "BMW:_Baked_Back_lights_texture1": "TailLampInner",
    }
    # windows_glass may already exist after first rename of `glass`
    for mat in list(bpy.data.materials):
        target = mapping.get(mat.name)
        if not target or mat.name == target:
            continue
        existing = bpy.data.materials.get(target)
        if existing and existing != mat:
            for obj in bpy.data.objects:
                for slot in getattr(obj, "material_slots", []):
                    if slot.material == mat:
                        slot.material = existing
            print(f"[KYRA] Merge {mat.name} -> {target}")
            bpy.data.materials.remove(mat)
        else:
            print(f"[KYRA] Rename {mat.name} -> {target}")
            mat.name = target


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


def disconnect_alpha(mat: bpy.types.Material):
    bsdf = principled(mat)
    alpha = bsdf.inputs.get("Alpha")
    if alpha is not None:
        if alpha.is_linked:
            for link in list(alpha.links):
                mat.node_tree.links.remove(link)
        alpha.default_value = 1.0
    mat.blend_method = "OPAQUE"
    if hasattr(mat, "use_screen_refraction"):
        mat.use_screen_refraction = False


def force_interior_opaque():
    """Baked cabin maps sit on black PNG padding. BLEND punches holes in seats/dash."""
    for mat in bpy.data.materials:
        key = compact(mat.name)
        if not key.startswith("interior"):
            continue
        disconnect_alpha(mat)
        print(f"[KYRA] Opaque interior {mat.name}")


def fix_cabin_glass():
    """
    Realtime tint needs the outer glass volumes, not the inner frames.

    BMW_Base_49 is the closed windshield+side glass. Object068/082/102/106 are
    duplicate side volumes inside it (double-tint + grey rims). Door/window
    frames (Object066, Base_28, Base_50) stay opaque so openings have trim.
    """
    hide_tokens = (
        "BMW_Base_12",  # low-poly cabin volume
        "BMW_Base_58",  # sunroof volume under the panorama shell
        "Object068",
        "Object082",
        "Object102",
        "Object106",
        "Object066",  # black door cards filling the side openings
        "Object081",
        "Object101",
        "Object105",
    )

    for obj in list(bpy.context.scene.objects):
        if obj.type != "MESH":
            continue
        if any(token in obj.name for token in hide_tokens):
            obj.hide_set(True)
            obj.hide_render = True
            obj.hide_viewport = True
            print(f"[KYRA] Hide duplicate glass {obj.name}")


def pack_images():
    for img in bpy.data.images:
        if img.filepath and Path(bpy.path.abspath(img.filepath)).exists():
            img.pack()
        print(f"[KYRA] Image {img.name} size={tuple(img.size)} packed={bool(img.packed_file)}")


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
        export_draco_mesh_compression_enable=False,
        export_image_format="AUTO",
        export_keep_originals=False,
    )
    try:
        bpy.ops.export_scene.gltf(**kwargs)
    except TypeError as err:
        print(f"[KYRA] glTF kwargs fallback: {err}")
        bpy.ops.export_scene.gltf(
            filepath=str(OUT),
            export_format="GLB",
            use_selection=True,
            export_draco_mesh_compression_enable=False,
        )
    print(f"[KYRA] Exported {OUT} ({OUT.stat().st_size} bytes)")


def main():
    clear_scene()
    import_fbx()
    scale_to_meters()
    restore_original_textures()
    tune_materials()
    rename_materials()
    force_interior_opaque()
    fix_cabin_glass()
    pack_images()
    report_bounds()
    export_glb()


if __name__ == "__main__":
    main()
