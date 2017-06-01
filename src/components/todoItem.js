import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';

import todoStore from '../stores/TodoStore';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

@observer
export default class TodoItem extends React.Component {
	@observable editText = "";
	// for the tags / category
	@observable editTag = "";
	render() {
		const {viewStore, todo, todoStore} = this.props;
		return (
				<li className={[
					todo.completed ? "completed": "",
					expr(() => todo === viewStore.todoBeingEdited ? "editing" : "")
				].join(" ")}>
					<div className="view">
						<input
							className="toggle"
							type="checkbox"
							checked={todo.completed}
							onChange={this.handleToggle}
						/>
						<label onDoubleClick={this.handleEdit}>
							{todo.title}
						</label>

						{/*edited by Sid*/}
						<div>
							<span onDoubleClick={this.handleEdit}>
								{todo.tag}
							</span>
						</div>

						<button className="destroy" onClick={this.handleDestroy} />
					</div>
					<input
						ref="editField"
						className="edit"
						placeholder="Todo Item"
						value={this.editText}
						onBlur={this.handleSubmit}
						onChange={this.handleChange}
						onKeyDown={this.handleKeyDown}
					/>

					{/* edited by Sid*/}
					<input
						ref="editField"
						className="edit"
						placeholder="Tag - use ',' to separate multiple tags"
						value={this.editTag}
						onBlur={this.handleSubmit}
						onChange={this.changeTag}
						onKeyDown={this.handleKeyDown}
					/>
				</li>
		);
	}

	handleSubmit = (event) => {
		const val = this.editText.trim();
		const tagVal = (this.editTag + "").trim();
		if (val) {
			this.props.todo.setTitle(val);
			this.editText = val;
		} 
		else {
			this.handleDestroy();
		}
		// edited by Sid
		if(tagVal){
			this.props.todo.addTag(tagVal);
			this.editTag = tagVal;
		}
		else{
			this.editTag = "Add Tag";
		}
		
		this.props.viewStore.todoBeingEdited = null;
	};

	handleDestroy = () => {
		this.props.todo.destroy();
		this.props.viewStore.todoBeingEdited = null;
	};

	handleEdit = () => {
		const todo = this.props.todo;
		this.props.viewStore.todoBeingEdited = todo;
		this.editText = todo.title;
		this.editTag = todo.tag;
	};

	handleKeyDown = (event) => {
		if (event.which === ESCAPE_KEY) {
			this.editText = this.props.todo.title;
			this.editTag = this.props.todo.tag.join(",");
			this.props.viewStore.todoBeingEdited = null;
		} else if (event.which === ENTER_KEY) {
			this.handleSubmit(event);
		}
	};

	handleChange = (event) => {
		this.editText = event.target.value;
	};

	// edited by Sid
	changeTag = (event) => {
		this.editTag = event.target.value;
	};

	handleToggle = () => {
		this.props.todo.toggle();
	};
}

TodoItem.propTypes = {
	todo: PropTypes.object.isRequired,
	viewStore: PropTypes.object.isRequired
};
