"""Inspect t7iquki8rj.blend then export Draco GLB for the sedan workshop."""

import bpy
from pathlib import Path

OUT = Path(r"d:\kyra\public\models\t7iquki8rj.glb")

PAINT_HINTS = (
    "carpaint",
    "car paint",
    "paint",
    "body",
    "coat",
    "lacquer",
    "enamel",
)


def dump_scene():
    print("[KYRA] Objects:")
    for obj in bpy.data.objects:
        if obj.type != "MESH":
            continue
        mats = [s.material.name if s.material else "-" for s in obj.material_slots]
        print(f"  MESH {obj.name} mats={mats}")
    print("[KYRA] Materials:")
    for mat in bpy.data.materials:
        print(f"  MAT {mat.name}")


def maybe_rename_paint():
    for mat in bpy.data.materials:
        n = (mat.name or "").lower().replace("_", " ")
        if any(h in n for h in PAINT_HINTS) and "glass" not in n and "light" not in n:
            if mat.name != "CarPaint":
                print(f"[KYRA] Rename paint {mat.name} -> CarPaint")
                mat.name = "CarPaint"


def export_glb():
    for obj in [o for o in bpy.data.objects if o.type in {"CAMERA", "LIGHT"}]:
        bpy.data.objects.remove(obj, do_unlink=True)

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
    except TypeError:
        bpy.ops.export_scene.gltf(filepath=str(OUT), export_format="GLB", use_selection=True)
    print(f"[KYRA] Exported {OUT} ({OUT.stat().st_size} bytes)")


dump_scene()
maybe_rename_paint()
export_glb()
