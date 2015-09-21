/*! granular-form-validation - v0.1.0 - 2015-09-21 */

var gfv = {};

gfv.initialize = function(form, userOptions) {
	var fieldsToValidate = form.querySelectorAll("*[data-gfv-validate]");
	if (fieldsToValidate.length === 0) {
		throw new Error("Validator initialized but no fields to validate were found");
	}

	// Set default options
	gfv.options = {
		'location': 'after',
		'errorListClass': 'error-list',
		'wrapper': '',
		'validateBeforeSubmit': 'afterFirstSubmit', 
		'errorFieldClass': false,
		'scrollToFirstError': 'scroll'
	}

	// Updated with custom options
	for(var property in userOptions) {
		if(userOptions.hasOwnProperty(property)) {
			gfv.options[property] = userOptions[property];
		}
	}

	form.addEventListener('submit', function(event) {
		if (fieldsToValidate.length > 0) {
			[].forEach.call(fieldsToValidate, function(field) {
				if (field.gfvErrorList) {
					if (field.gfvErrorList.parentNode) {
						field.gfvErrorList.parentNode.removeChild(field.gfvErrorList);
					}
				}
				if (typeof gfv.options.errorFieldClass === 'string') {
					field.classList.remove(gfv.options.errorFieldClass);
				}
			});
			var invalidFields = gfv.validateFields(fieldsToValidate);
			if (invalidFields.length > 0) {
				event.preventDefault();
				if (gfv.options.validateBeforeSubmit === 'afterFirstSubmit') {
					form.setAttribute('data-gfv-submitted-once','true');
				}
				gfv.placeErrors(invalidFields);

				if (gfv.options.scrollToFirstError === 'scroll') {
					$('html, body').animate({
						scrollTop: $(invalidFields[0]).offset().top - 50
					}, 500);
				}
			}
		}
	});

	gfv.watchFields(form, fieldsToValidate);
};


gfv.watchFields = function(form, fieldsToValidate) {
	[].forEach.call(fieldsToValidate, function(field) {
		var type = field.type;
		var event = "";

		switch(type) {
			case 'text':
			case 'textarea':
			case 'email':
			case 'password':
				event = 'keyup';
				break;
			case 'checkbox':
				event = 'click';
				break;
			case 'file':
				event = 'change';
				break;
		}

		field.addEventListener(event, function() {
			if (gfv.options.validateBeforeSubmit === 'afterFirstSubmit' && form.getAttribute('data-gfv-submitted-once')) {
				if (field.gfvErrorList) {
					if (field.gfvErrorList.parentNode) {
						field.gfvErrorList.parentNode.removeChild(field.gfvErrorList);
					}
				}
				if (typeof gfv.options.errorFieldClass === 'string') {
					field.classList.remove(gfv.options.errorFieldClass);
				}
				var invalidFields = gfv.validateFields(field);
				gfv.placeErrors(invalidFields);
			}
		});
	});

};
gfv.validateFields = function(fieldsToValidate) {
	var invalidFields = [];
	// If we're only passing in a single element, recast it as an array
	if (!fieldsToValidate.length) {
		var array = [];
		array.push(fieldsToValidate);
		fieldsToValidate = array;
	}

	[].forEach.call(fieldsToValidate, function(field) {
		field.gfvErrors = [];
		allValidations = field.getAttribute('data-gfv-validate').split(',');
		
		value = field.value;
		if (field.getAttribute('type') === 'checkbox') {
			if (field.checked) {
				value = 'checked';
			} else {
				value = '';
			}
		}

		allValidations.forEach(function(validation) {
			validate = validation.split(":");
			var error = gfv.checkField(validate, value);
			if (error) {
				field.gfvErrors.push(error);
			}
		});

		if (field.gfvErrors.length > 0) {
			invalidFields.push(field);
		}

	});

	return invalidFields;
};


gfv.checkField = function(check, value) {
	switch(check[0]) {
		case "required":
			if (value === "") {
				return "This field is required.";
			}
			break;

		case "emailLite":
			// checking for something, @, something, ., and at least two somethings after that.
			var emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
			if (!emailRegExp.test(value)) {
				return "Enter a valid e-mail address.";
			}
			break;

		case "email":
			// As per the HTML5 Specification
			// most technically correct, but many will not see it as practical
			// because it doesn't require a period after the @
			var emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			if (!emailRegExp.test(value)) {
				return "Enter a valid e-mail address.";
			}
			break;

		case "minlength":
			if (value.length < check[1]) {
				return "Must be at least " + check[1] + " characters.";
			}
			break;
			
		case "maxlength":
			if (value.length > check[1]) {
				return "Cannot be more than " + check[1] + " characters.";
			}
			break;

		case "matches":
			var valueToMatch = document.getElementById(check[1]).value;
			if (value !== valueToMatch) {
				var label = document.querySelector('label[for='+ check[1] +']').textContent.trim();
				return "Must match " + label + " field.";
			}
			break;
	}
};
gfv.placeErrors = function(invalidFields) {
	invalidFields.forEach(function(invalidField) {
		// Create our error list. Current default is an unordered list, and the
		// class name can be specified.
		var errorList = document.createElement('ul');
		if (gfv.options.errorListClass) {
			errorList.classList.add(gfv.options.errorListClass);
		}
		invalidField.gfvErrors.forEach(function(error) {
			var li = document.createElement('li');
			li.textContent = error;
			errorList.appendChild(li);
		});

		if (typeof gfv.options.errorFieldClass === 'string') {
			invalidField.classList.add(gfv.options.errorFieldClass);
		}

		// Figure out where to place our error list. If a wrapper is specified,
		// find the wrapper. Otherwise, place the list itself.
		var elementToPlace;
		if (gfv.options.wrapper) {
			// We're going to generally trust that if the user has specified
			// a wrapper and a direction, it's there somewhere.
			// First, we'll look at direct siblings. If nothing, then we'll
			// go up a level and then check siblings. After that, we'll assume
			// something went wrong (though we could go up another level and
			// and check).
			if (gfv.options.location === 'after') {
				var next = invalidField.nextElementSibling;
				while (next) {
					if (next.classList.contains(gfv.options.wrapper)) {
						elementToPlace = next;
						break;
					} 
					next = next.nextElementSibling;
				}
				// siblings didn't work, let's look at aunts and uncles.
				if (typeof elementToPlace === 'undefined') {
					next = invalidField.parentNode.nextElementSibling;
					while (next) {
						if (next.classList.contains(gfv.options.wrapper)) {
							elementToPlace = next;
							break;
						} 
						next = next.nextElementSibling;
					}
				}
			} else if (gfv.options.location === 'before') {
				var prev = invalidField.previousElementSibling;
				if (prev.classList.contains(gfv.options.wrapper)) {
					elementToPlace = prev;
				}
			}
			if (typeof elementToPlace === 'undefined') {
				throw new Error("Could not find element to place error list");
			} else {
				elementToPlace.appendChild(errorList);
				// TODO: check if a child node already has the same tagName and class as the one we're inserting. If so, deleted it before appending the new one. This would prevent duplicates in server side messages. Another way to do this would be to change how the error lists get cleared; right now they're based on front end validation errors raised, but it could be changed to do something where it just searches for the class inside our target form.
			}
		} else {
			elementToPlace = errorList;
			if (gfv.options.location === 'after') {
				// "insertAfter"
				invalidField.parentNode.insertBefore(elementToPlace, invalidField.nextSibling);
			} else if (gfv.options.location === 'before') {
				invalidField.parentNode.insertBefore(elementToPlace, invalidField);
			}
		}

		invalidField.gfvErrorList = errorList;
	});
};