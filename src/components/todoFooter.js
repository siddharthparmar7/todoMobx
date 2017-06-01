import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {pluralize} from '../utils';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, FILTERING } from '../constants';

@observer
export default class TodoFooter extends React.Component {
	
	render() {
		const todoStore = this.props.todoStore;
		if (!todoStore.activeTodoCount && !todoStore.completedCount)
			return null;

		const activeTodoWord = pluralize(todoStore.activeTodoCount, 'item');
		const categoryTags = todoStore.allTodoTags;

		return (
			<footer className="footer">
				<span className="todo-count">
					<strong>{todoStore.activeTodoCount}</strong> {activeTodoWord} left
				</span>
				<ul className="filters">
					{this.renderFilterLink(ALL_TODOS, "", "All", false)}
					{this.renderFilterLink(ACTIVE_TODOS, "active", "Active", false)}
					{this.renderFilterLink(COMPLETED_TODOS, "completed", "Completed", false)}
					{categoryTags.map( todo => this.renderFilterLink(FILTERING, "filtering", (todo),true))}
				</ul>
				{ todoStore.completedCount === 0
					? null
					: 	<button
							className="clear-completed"
							onClick={this.clearCompleted}>
							Clear completed
						</button>
				}
			</footer>
		);
	}

	tmpTagArray = [];

	renderFilterLink(filterName, url, caption, isFiltering) {
		var counter = 1;
		if(!isFiltering )
		{
		return (<li>
					<a href={"#/" + url }
						className={filterName ===  this.props.viewStore.todoFilter ? "selected" : ""}>
						{caption}
					</a>
					{' '}
				</li>)
		}else{
			caption = (caption + "").split(",");
			caption.map((tag) => this.tmpTagArray.push(tag))

			return (<li key={Date.now() + caption}>
				{
					caption != "false" && caption != "" ? caption.map((caption) => 
					<a key={Date.now() + caption} href={"#/" + url + "/" + caption } 
					className={filterName ===  this.props.viewStore.todoFilter ? "selected" : ""}>
					{caption != "false" ? caption : ""}
					</a> )
					: "" 
				}
				{' '}
			</li>
			)
		}
	}

	clearCompleted = () => {
		this.props.todoStore.clearCompleted();
	};
}

TodoFooter.propTypes = {
	viewStore: PropTypes.object.isRequired,
	todoStore: PropTypes.object.isRequired
}
