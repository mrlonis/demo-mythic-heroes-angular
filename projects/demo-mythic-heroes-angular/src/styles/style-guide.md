# Style Guide for shared styles

## Including in your project

To Include in your project

1. Add a \_theme.scss file and import the shared theme. Perform any customizations to the theme here if necessary

```
@use '~@mrlonis/ngx-shared/assets/theme' as mrlonis;

// define variables for these in case we ever want to customize them
// components that need the theme or typography should import this file
$mrlonis-my-app-primary: mrlonis.$mrlonis-default-app-primary;
$mrlonis-my-app-accent: mrlonis.$mrlonis-default-app-accent;
$mrlonis-my-app-warn: mrlonis.$mrlonis-default-app-warn;
$mrlonis-my-app-theme: mrlonis.$mrlonis-default-app-theme;
$mrlonis-my-typography: mrlonis.$mrlonis-default-typography;
```

2. Import the \_theme.scss within your main styles scss along with material's setup and call the shared library's mixin (in @mrlonis/ngx-shared/assets/controls) to setup the styles

```
@use '~@angular/material' as mat;
// Plus imports for other components in your app.
@use './theme';
@use '~@mrlonis/ngx-shared/assets/controls' as controls;
// Include the common styles for Angular Material. We include this here so that you only
// have to load a single css file for Angular Material in your app.
// Be sure that you only ever include this mixin once!
@include mat.core();

@include mat.all-component-themes(theme.$mrlonis-my-app-theme);
@include mat.all-component-typographies(theme.$mrlonis-my-typography);
@include controls.mrlonis-shared-all(
  theme.$mrlonis-my-app-theme
);

```

3. Make sure you've added Open Sans font and Material Icons to your index.html and added mat-typography and mat-app-background classes to your body element.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    ... other html ...
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
  </head>
  <body class="mat-typography mat-app-background">
    <mrlonis-root></mrlonis-root>
  </body>
</html>
```

## Typography

The typography styles are mapped to the design guide in this way:

| Name                      | Selectors                      |
| ------------------------- | ------------------------------ |
| Open Sans - Regular - 30  | h1, .mat-h1, .mat-headline     |
| Open Sans - Regular - 20  | h2, .mat-h2, .mat-title        |
| Open Sans - Regular - 18  | h3, .mat-h3, .mat-subheading-2 |
| Open Sans - Regular - 14  | body (default)                 |
| Open Sans - Semibold - 13 | h4, .mat-h4                    |
| Open Sans - Semibold - 12 | ??                             |
| Open Sans - Regular - 12  | label, .form-field-label       |
| Open Sans - Bold - 10     | h5, .mat-h5                    |
| Open Sans - Semibold - 9  | h6, .mat-h6                    |

## Colors

The colors are mapped as follows:

| Color                | Palette Reference   |
| -------------------- | ------------------- |
| #014d93 (blue)       | primary 500/default |
| #003476 (dark blue)  | primary 900         |
| #7eba46 (green)      | accent 500/default  |
| #569100 (dark green) | accent 900          |

In addition there are utility classes for background and text color styles

- .primary-background
- .primary-background-dark
- .accent-background
- .accent-background-dark
- .contrast-text: Applies corresponding contrast text color when used with the above background classes
- .primary-text
- .primary-text-dark
- .accent-text
- .accent-text-dark

## Layout

### .detail-page-header

Used for the white header section at the top of detail pages. This should
usually have an h1 tag inside

```html
<div class="detail-page-header">
  <h1>My Page Header</h1>
</div>
```

### .detail-page-content

Applies margins/padding for the detail content section. The mrlonis-page-tabs class will apply similar styling to content within material tab groups.

### cards

Use material cards (mat-card) to separate sections within the page. Apply the mrlonis-card class to each card.

## Forms

- Wrap form fields and labels in a container element with a form-field-container class
- Put a label element above the mat-form-field element with a form-field-label class
- Use appearance="outline" on the mat-form-field
- Do not include mat-label inside the mat-form-field

```
  <div class="form-field-container">
    <label class="form-field-label">Last Name</label>
    <mat-form-field appearance="outline">
      <input matInput required>
    </mat-form-field>
  </div>
```

## Readonly Data

When displaying readonly data. Use a label element + a container for the data content.

```html
<div>
  <label>Patient Name</label>
  <div>Joe Smith</div>
</div>
```

## Buttons

Use material buttons with the appropriate color setting ("accent" or "primary") for standard buttons.

- mat-button for buttons with no border

  `<button mat-button color="accent">Basic</button>`

- mat-stroked-button for a button with border and no fill

  `<button mat-stroked-button color="accent">Cancel</button>`

- mat-flat-button for a button with fill

  `<button mat-flat-button color="accent">Save Changes</button>`

Use the pill-button class and approriate color class for pill buttons (rounded buttons with a light colored background)

`<button class="pill-button accent"><mat-icon>edit</mat-icon>Edit</button>`

`<button class="pill-button warn"><mat-icon>delete</mat-icon>Delete</button>`

`<button class="pill-button primary"><mat-icon>clear</mat-icon>Cancel</button>`

# Tags

List of tags can be displayed with the tag and tag-list classes. You can either include the color class on the tag or with the tag-list element to style all tags within the list.

**Single tag**

`<div class="tag accent">Freeform Tag</div>`

**Tag List**

```html
<div class="tag-list accent">
  <div class="tag">Freeform Tag 1</div>
  <div class="tag">Freeform Tag 2</div>
  <div class="tag">Freeform Tag 3</div>
</div>
```
