import {observable} from 'mobx';

export default class TodoModel {
	store;
	id;
	@observable title;
	@observable completed;
	// edited by Sid
	@observable tag = [];

	// edited by Sid
	constructor(store, id, title, tag, completed) {
		this.store = store;
		this.id = id;
		this.title = title;
		this.completed = completed;
		// edited by Sid
		this.tag = tag;
	}

	toggle() {
		this.completed = !this.completed;
	}

	destroy() {
		// this.tag.map((tag) => this.tag.remove(tag));
		// console.log(this.tag.length);
		this.store.todos.remove(this);
	}

	setTitle(title) {
		this.title = title;
	}

// edited by Sid
	addTag(tag) {
		var tags = [];
		tags = tag.split(",").map((word) => word.trim());
		tags = this.uniq(tags);
		this.tag = tags;		
	}

	//  remove duplicates from the array
	uniq = (arrArg) => {
  				return arrArg.filter((elem, pos, arr) => {
    			return arr.indexOf(elem) == pos;
  				});
			}

	toJS() {
		return {
			id: this.id,
			title: this.title,
			tag: this.tag,
			completed: this.completed
		};
	}

	static fromJS(store, object) {
		return new TodoModel(store, object.id, object.title, object.tag, object.completed);
	}
}
