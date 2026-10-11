# Physics numerical contracts

Shared canonical decimals (30 significant input digits, exponent magnitude at most100), 50 working digits, no intermediate presentation rounding and checked output bounds. Fixed SI input/output units; no inference or conversions. Invalid fields and exact domain failures are explicit.

| Calculator | Formula and domain | Independent fixtures |
|---|---|---|
| Average speed | distance metres ≥0 / elapsed seconds >0 -> m/s; travelled path, not displacement |120/10=12;0/5=0;1500/300=5|
| Net force | mass kilograms >0 × signed acceleration m/s² -> N; constant mass, inertial frame, one signed axis |10×2=20;3×−4=−12;5×0=0|
| Classical kinetic energy | mass kilograms >0 × nonnegative speed m/s squared /2 -> J; nonrelativistic model |2×3²/2=9;10×0²/2=0;4×5²/2=50|
| Average power | signed transferred joules / elapsed seconds >0 -> W; sign convention user-owned |1000/10=100;−60/3=−20;0/5=0|
| Bulk density | nonnegative kilograms / cubic metres >0 -> kg/m³ |10/2=5;1000/1=1000;0/3=0|
| Average compressive pressure | nonnegative normal newtons / square metres >0 -> Pa |100/2=50;1000/0.5=2000;0/3=0|

Lessons explain average-versus-instantaneous quantities, reference frames, dimensional errors, and model limits. Pure numeric relationships do not constitute engineering design verification.

## Video status

Speed, force, energy, power, density and pressure are explicitly **video pending**. Narration and wide/tall render verification remain launch readiness work.
