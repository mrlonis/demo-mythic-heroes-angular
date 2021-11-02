# This folder contains the exported shared styles for the library

## Guidelines

- All style files should be defined as mixins
- The file should include at least 1 mixin named "all". This will define all styles (color, typography, margins/padding, etc). If there is a need for
  consumers to only apply part of the styles (like color, typography) we can split these up later similar to how material design is structured.
- Include a reference to the file in \_controls.scss. There should be both a @use statement and @forward statement. Call the mixin inside zotec-shared-all mixin.
- Try and use values from the palette whenever possible for typography and colors.
