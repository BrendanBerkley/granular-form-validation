# Granular Form Validation

From project to project, forms tend to be just different enough to make many validation libraries difficult to work with - they want you to use their naming conventions, they have an e-mail validation pattern that's not quite what you need, they don't have a validation pattern that you do need, and so on.

I'm envisioning a library where:
- Validation happens separately from displaying the content
- Error message display can be customized
- Custom validations are easily added
- Custom builds would make it easy to exclude unnecessary validations

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


## Future validation checks
- Password strength
- Password blacklist