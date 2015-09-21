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