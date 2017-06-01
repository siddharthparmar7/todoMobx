import {observable, computed, reaction} from 'mobx';
import TodoModel from '../models/TodoModel'
import * as Utils from '../utils';

export default class TodoStore {
	@observable todos = [];
	allTags = [];
	@observable filter = "";
	@observable filtering = false;

	@computed get activeTodoCount() {
		return this.todos.reduce(
			(sum, todo) => sum + (todo.completed ? 0 : 1),
			0
		)
	}

	@computed get completedCount() {
		return this.todos.length - this.activeTodoCount;
	}

	@computed get allTodoTags() {

		this.todos.map((todo) => (todo.tag + "").split(",").map((tag) => this.allTags.push(tag)));
		return this.uniq(this.allTags);
	}

	@computed get filteredTodos() {
		if(this.filter === ""){
			return this.todos;
		}else{
			var resultToDos = new RegExp(this.filter, "i");
			return this.todos.filter(todo => !this.filter || resultToDos.test(todo.tag));
		}
	}

//  remove duplicates from the array
	uniq = (arrArg) => {
  				return arrArg.filter((elem, pos, arr) => {
    			return arr.indexOf(elem) == pos;
  				});
			}

	subscribeServerToStore() {
		reaction(
			() => this.toJS(),
			todos => fetch('/api/todos', {
				method: 'post',
				body: JSON.stringify({ todos }),
				headers: new Headers({ 'Content-Type': 'application/json' })
			})
		);
	}

	subscribeLocalstorageToStore() {
		reaction(
			() => this.toJS(),
			todos => localStorage.setItem('mobx-react-todomvc-todos', JSON.stringify({ todos }))
		);
	}

	addTodo (title) {
		this.todos.push(new TodoModel(this, Utils.uuid(), title, false));
	}

	toggleAll (checked) {
		this.todos.forEach(
			todo => todo.completed = checked
		);
	}

	clearCompleted () {
		this.todos = this.todos.filter(
			todo => !todo.completed
		);
	}

	// edited by Sid
	addTag (tag) {
		this.todos.tag = tag;
		this.allTags.push(tag);
	}

	toJS() {
		return this.todos.map(todo => todo.toJS());
	}

	static fromJS(array) {
		const todoStore = new TodoStore();
		todoStore.todos = array.map(item => TodoModel.fromJS(todoStore, item));
		return todoStore;
	}
}

