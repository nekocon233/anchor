# Audio Sources

These `.wav` files are original procedural prototype sounds generated for this
repository.

They are not downloaded from third-party libraries. They can be replaced later
with curated licensed assets while keeping the same file names and Phaser audio
keys.

The game supports both `.mp3` and `.wav` under `public/audio/`. If both exist
for the same key, the `.mp3` file is loaded first; otherwise the generated
`.wav` fallback is used.

All ambience keys (`amb_*`) first try to load `public/audio/amb.mp3`. If that
shared file is not present, they fall back to their individual ambience files.

All anchor drop keys (`anchor_drop_*`) first try to load
`public/audio/anchor_drop.mp3`. If that shared file is not present, they fall
back to their individual drop files.
