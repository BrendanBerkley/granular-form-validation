# Granular Form Validation

From project to project, forms tend to be just different enough to make many validation libraries difficult to work with - they want you to use their naming conventions, they have an e-mail validation pattern that's not quite what you need, they don't have a validation pattern that you do need, and so on.

I'm envisioning a library where:
- Validation happens separately from displaying the content
- Validation doesn't make DOM decisions for you; that is, validations are tied to the form fields rather than wrapper elements wherever possible
- Error message display can be customized
- Custom validations are easily added
- Custom builds would make it easy to exclude unnecessary validations
- Everything is coded in vanilla JS, making it easier to integrate into any framework

## Project sections
Made these up to help compartmentalize the project and categorize Taiga tasks. [Taiga project >>](https://tree.taiga.io/project/brendan-granular-validation)

- Structure: Project structure, JS structure
- Validation: Reading the validations, checking field values
- Error Display: Translating validation errors to the DOM
- Documentation: Docs, examples
- Generator: Generate custom scripts, host validation pattern library

## Adding validations

On a form input you want to validate, add the attribute `data-gfv-validate`. Inside, type what kinds of checks you want to run. No spaces, separate by commas. Here's what's available:

- **required**: checks field value for something, anything
- **email**: checks field value against the HTML5 spec's email regex
- **minlength:i**: checks field value against i
- **maxlength:i**: checks field value against i
- **matches:id**: checks if field value is equal to the value of a specified ID
- **emailLite**: checks field value against a light regex; looking for a character, an ampersand, a character, a period, and at least two characters. 

### Sample implementation 
`<input type="text" data-gfv-validate="required,minlength:10" />`

## Rendering error messages
- location - place the errors 'before' (FUTURE) or 'after' the field being validated
- errorListClass - target the error list with a specific class
- wrapper - place errorlist inside an element
- validateBeforeSubmit - 'always' (FUTURE) to go as soon as the user starts typing input, 'submitOnly' (FUTURE) to only check when submit button is pressed, 'afterFirstSubmit' to not check until the button is pressed once, and then always check the fields after that
- errorFieldClass - adds a specified class to the erroneous field, unless false
- scrollToFirstError - 'jump' to go straight there (FUTURE), 'scroll' to smooth scroll (TODO: remove jQuery dependency), 'none' to do nothing (FUTURE).
- disableSubmit (FUTURE) - don't allow submit button to be pressed if true. 
- errorElement (FUTURE) - `ul` by default to create a list; `ol`, `div`, and `p` should be acceptable

## Default Options
- `'location': 'after'`: Errors will show after the field in question
- `'errorListClass': 'error-list'`: Error list will get this class
- `'wrapper': ''`: error list will not go in a wrapper div of any kind.
- `'validateBeforeSubmit': 'afterFirstSubmit'`: Will not validate until user tries to submit once 
- `'errorFieldClass': false`: field doesn't get tagged with an error on validation
- `'scrollToFirstError': 'scroll'`: Will smooth scroll by default.


## Future validation checks
- Password strength
- Password blacklist