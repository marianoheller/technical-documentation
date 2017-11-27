import React, { Component } from 'react';
import loremIpsum from 'lorem-ipsum';
import config from './config';
import 'purecss';
import './App.css';


class App extends Component {
	/*

	topic: -> {
		title: "",
		intro: "",
		paragraphs: [
			{
				subtitle: "",
				text: "",
			}
		]
	}
	 */

	constructor(props) {
		super(props);

		this.state = {
			topics: [],
			currentTopicIndex: 0,
		}
	}

	componentWillMount() {
		this.setState({
			topics: this.generateDocs(),
		})
	}

	generateDocs() {
		return (new Array(config.cantTopics)).fill(0).map( () => ({
			title: loremIpsum({
				count: 1, 
				units: 'sentence',
				sentenceLowerBound: 1,
				sentenceUpperBound: 2,
				format: 'plain'
			}),
			intro: loremIpsum({
				count: 1, 
				units: 'paragraphs',
				paragraphLowerBound: 3,
  				paragraphUpperBound: 7,
				format: 'plain'
			}),
			paragraphs: (new Array(config.topic.cantParagraphs)).fill(0).map( () => ({
				subtitle: loremIpsum({
					count: 1, 
					units: 'sentence',
					sentenceLowerBound: 1,
					sentenceUpperBound: 3,
					format: 'plain'
				}),
				text: loremIpsum({
					count: 1, 
					units: 'paragraphs',
					paragraphLowerBound: 5,
					paragraphUpperBound: 10,
					format: 'plain'
				})
			}))
		}))
	}

	handleSideBarClick(topicIndex) {
		this.setState({
			currentTopicIndex: topicIndex
		})
	}

	render() {
		const { topics, currentTopicIndex } = this.state;
		const titles = topics.map( (topic) => topic.title );
		const currentTopic = topics[currentTopicIndex];
		return (
			<div className="App">
				<div className="pure-g">
					<div className="pure-u-1-12"></div>
					<div className="pure-u-10-12">
						<div className="pure-g">
							<div className="pure-u-1-4">
								<SideBar titles={titles} onClick={this.handleSideBarClick.bind(this)}/>
							</div>
							<div className="pure-u-3-4">
								<Topic topic={currentTopic} />
							</div>
						</div>
					</div>
					<div className="pure-u-1-12"></div>
				</div>
			</div>
		);
	}
}

class SideBar extends Component {

	handleClickFactory(index) {
		const { onClick } = this.props;
		return () => {
			onClick(index);
		}
	}

	render() {
		const items = this.props.titles.map( (title, i) => 
			<SideBarItem key={`title${i}`} title={title} onClick={this.handleClickFactory(i)}/>
		);
		return (
			<div className="pure-menu custom-restricted-width">
				<span className="pure-menu-heading">Topics</span>
				<ul className="pure-menu-list">
					{items}
				</ul>
			</div>
		)
	}
}

class SideBarItem extends Component {
	render() {
		const title = this.props.title.replace('.', '');
		const maxTLength = 20;
		return (
			<li className="pure-menu-item">
				<a className="pure-menu-link" onClick={this.props.onClick}>
					{ title.length > maxTLength ? `${title.substr(0, maxTLength-2)}...` : title}
				</a>
			</li>
		)
	}
}


class Topic extends Component {
	render() {
		const { topic } = this.props;
		return (
			<div>
				<h1>{topic.title.replace('.', '')}</h1>
				<p>{topic.intro}</p>
				{ topic.paragraphs.map( (paragraph, i) => (
					<div key={`p${i}`}>
						<h2>{paragraph.subtitle}</h2>
						<p>{paragraph.text}</p>
					</div>
				) )}
			</div>
		)
	}
}



export default App;


/*
output = loremIpsum({
    count: 1                      // Number of words, sentences, or paragraphs to generate. 
  , units: 'sentences'            // Generate words, sentences, or paragraphs. 
  , sentenceLowerBound: 5         // Minimum words per sentence. 
  , sentenceUpperBound: 15        // Maximum words per sentence. 
  , paragraphLowerBound: 3        // Minimum sentences per paragraph. 
  , paragraphUpperBound: 7        // Maximum sentences per paragraph. 
  , format: 'plain'               // Plain text or html 
  , words: ['ad', 'dolor', ... ]  // Custom word dictionary. Uses dictionary.words (in lib/dictionary.js) by default. 
  , random: Math.random           // A PRNG function. Uses Math.random by default 
  , suffix: EOL                   // The character to insert between paragraphs. Defaults to default EOL for your OS. 
});
*/