Todos.TodoController = Ember.ObjectController.extend({

	bufferedTitle: Ember.computed.oneWay('title'),

	actions: {
		editTodo: function() {
			this.set('isEditing', true);
		},

		doneEditing: function() {
			var bufferedTitle = this.get('bufferedTitle').trim();

			if (Ember.isEmpty(bufferedTitle)) {
				// The doneEditing action gets sent twice when the user hits
				// enter (via insert-newline and once via 'focus out').
				//
				// We debounce our call to 'removeTodo' so that it only gets
				// made once.
				Ember.run.debounce(this, 'removeTodo', 0);
			} else {
				var todo = this.get('model');
				todo.set('title', bufferedTitle);
				todo.save();
			}

			// Re-set our newly edited title to persists its trimmed version
			this.set('bufferedTitle', bufferedTitle);
			this.set('isEditing', false);

		},

		cancelEditing: function() {
			this.set('bufferedTitle', this.get('title'));
			this.set('isEditing', false);
		},

		removeTodo: function() {
			var todo = this.get('model');
			todo.deleteRecord();
			todo.save();
		},

		saveWhenCompleted: function () {
			this.get('model').save();
		}.observes('isCompleted')
	},


	isEditing: false,

	isCompleted: function(key, value) {
		var model = this.get('model');

		if (value === undefined) {
			// property being used as a getter
			return model.get('isCompleted');
		} else {
			// property being used as a setter
			model.set('isCompleted', value);
			model.save();
			return value;
		}
	}.property('model.isCompleted')
});