# KYRA 3D Simulator Models

Studio GLB exports used by the wrap simulator workshop.

| File | Source | Used for |
|------|--------|----------|
| `86ql3dghcf0.glb` | Hum3D Porsche 911 Carrera 4S (`86ql3dghcf0.blend`) | Sedan, Coupe |
| `cs6hv1t8ckpbo.glb` | Discovery-style SUV (`cs6hv1t8ckpbo.blend`) | SUV, Mini SUV |
| `gqbnkbwsmehl.glb` | Studio vehicle (`gqbnkbwsmehl.blend`) | Pickup, Hatchback |
| `toy-car.glb` | [Khronos ToyCar](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/ToyCar) | Fallback / legacy |
| `car-concept.glb` | [Khronos CarConcept](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept) | Fallback / legacy |

Re-export from Blender with:

```text
D:\blender.exe --factory-startup --background "<file>.blend" --python "3d models/export_glb.py" -- --out "public/models/<name>.glb"
```
