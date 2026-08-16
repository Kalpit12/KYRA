# KYRA 3D Simulator Models

Studio GLB exports used by the wrap simulator workshop.

These files must be **real binary `.glb` assets** in the deployment. If Vercel
only receives a Git LFS pointer (`version https://git-lfs.github.com/...`),
Three.js fails with `Unexpected token 'v', "version ht"... is not valid JSON`.

Keep models under GitHub’s ~100MB limit as normal git files. If a future export
is larger, track it with Git LFS **and** enable Git LFS in Vercel → Project
Settings → Git, then redeploy.

| File | Source | Used for |
|------|--------|----------|
| `t7iquki8rj.glb` | BMW M3 Competition G80 (`t7iquki8rj.blend`) | Sedan |
| `audi-a7-sedan.glb` | CGTrader Audi A7 Sportback OBJ | Legacy sedan export |
| `86ql3dghcf0.glb` | Hum3D Porsche 911 Carrera 4S (`86ql3dghcf0.blend`) | Coupe |
| `cs6hv1t8ckpbo.glb` | Discovery-style SUV (`cs6hv1t8ckpbo.blend`) | SUV, Mini SUV |
| `gqbnkbwsmehl.glb` | Studio vehicle (`gqbnkbwsmehl.blend`) | Pickup, Hatchback |
| `toy-car.glb` | [Khronos ToyCar](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/ToyCar) | Fallback / legacy |
| `car-concept.glb` | [Khronos CarConcept](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept) | Fallback / legacy |

Re-export from Blender with:

```text
D:\blender.exe --factory-startup --background "<file>.blend" --python "3d models/export_glb.py" -- --out "public/models/<name>.glb"
```
