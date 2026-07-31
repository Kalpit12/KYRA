"""
Export the active Blender scene as GLB for the KYRA customs workshop.
Usage:
  blender --factory-startup --background file.blend --python export_glb.py -- --out path/to/out.glb
"""

import bpy
import sys
from pathlib import Path


def parse_args():
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1 :]
    else:
        argv = []

    out = None
    i = 0
    while i < len(argv):
        if argv[i] == "--out" and i + 1 < len(argv):
            out = Path(argv[i + 1])
            i += 2
        else:
            i += 1
    return out


def clean_scene():
    remove_types = {"CAMERA", "LIGHT"}
    for obj in [o for o in bpy.data.objects if o.type in remove_types]:
        bpy.data.objects.remove(obj, do_unlink=True)


def export_glb(out_path: Path):
    out_path.parent.mkdir(parents=True, exist_ok=True)

    mesh_objs = [
        obj
        for obj in bpy.context.scene.objects
        if obj.type == "MESH" and obj.visible_get()
    ]
    use_selection = False
    if mesh_objs:
        bpy.ops.object.select_all(action="DESELECT")
        for obj in mesh_objs:
            obj.select_set(True)
        bpy.context.view_layer.objects.active = mesh_objs[0]
        use_selection = True

    kwargs = dict(
        filepath=str(out_path),
        export_format="GLB",
        use_selection=use_selection,
        export_apply=True,
        export_texcoords=True,
        export_normals=True,
        export_materials="EXPORT",
        export_cameras=False,
        export_lights=False,
        export_animations=False,
    )

    try:
        bpy.ops.export_scene.gltf(**kwargs)
    except TypeError:
        # Blender version differences in operator props
        bpy.ops.export_scene.gltf(
            filepath=str(out_path),
            export_format="GLB",
            use_selection=use_selection,
        )

    print(f"[KYRA] Exported: {out_path} ({out_path.stat().st_size} bytes)")


def main():
    out = parse_args()
    if out is None:
        blend = Path(bpy.data.filepath)
        out = Path(r"d:\kyra\public\models") / f"{blend.stem}.glb"

    print(f"[KYRA] Source: {bpy.data.filepath}")
    print(f"[KYRA] Objects: {len(bpy.data.objects)}")
    print(f"[KYRA] Output: {out}")
    clean_scene()
    export_glb(out)


if __name__ == "__main__":
    main()
