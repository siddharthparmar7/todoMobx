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
					{/*{console.log(categoryTags[1].tag[0])}*/}
					{categoryTags.map( todo => this.renderFilterLink(FILTERING, "filtering", (todo.tag),true))}
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
		}
		else{
			// console.log(caption[0]);
			caption = (caption + "").split(",");
			caption.map((tag) => this.tmpTagArray.push(tag))

			var uniq = (arrArg) => {
  				return arrArg.filter((elem, pos, arr) => {
    			return arr.indexOf(elem) == pos;
  				});
			}

			if(this.tmpTagArray.indexOf(caption) != -1 || this.tmpTagArray.length == 0){
				caption.map((tag) => this.tmpTagArray.push(tag))
			}

			// this.tmpTagArray = uniq(this.tmpTagArray);
			// console.log("unique " + this.tmpTagArray);
			return (

				<li key={Date.now() + caption}>
				{
					Array.isArray(caption) === true ? caption.map((caption) => 
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
