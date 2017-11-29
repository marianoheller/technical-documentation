import React, { Component } from 'react';
import loremIpsum from 'lorem-ipsum';
import config from './config';
import 'purecss';
import './App.css';


class App extends Component {
	/*

	section: -> {
		title: "",
		id: "",
		paragraphs: [
			{
				text: "",
			}
		],
		bulletpoints: [
			{
				text: "",
			}
		]
	}
	 */

	constructor(props) {
		super(props);

		this.state = {
			sections: [],
		}
	}

	componentWillMount() {
		this.setState({
			sections: this.generateDocs(),
		})
	}

	generateDocs() {
		const { paragraphs, bulletpoints } = config.section;
		return (new Array(config.cantSections)).fill(0).map( () => ({
			title: loremIpsum({
				count: 1, 
				units: 'sentence',
				sentenceLowerBound: 1,
				sentenceUpperBound: 2,
				format: 'plain'
			}),
			paragraphs: (new Array( randomIntBetween( paragraphs.max, paragraphs.min))).fill(0).map( () => ({
				text: loremIpsum({
					count: 1, 
					units: 'paragraphs',
					paragraphLowerBound: 5,
					paragraphUpperBound: 10,
					format: 'plain'
				})
			})),
			bulletpoints: (new Array(randomIntBetween(bulletpoints.max, bulletpoints.min))).fill(0).map( () => ({
				text: loremIpsum({
					count: 1, 
					units: 'sentence',
					sentenceLowerBound: 3,
					sentenceUpperBound: 5,
					format: 'plain'
				})
			}))
		}))
	}

	render() {
		const { sections } = this.state;
		const titles = sections.map( (section) => section.title );
		return (
			<div className="App">
				<div className="pure-g">
					<div className="pure-u-1-12"></div>
					<div className="pure-u-10-12">
						<div className="pure-g">
							<main id="main-doc">
								<div className="pure-u-1-4">
									<SideBar titles={titles}/>
								</div>
								<div className="pure-u-3-4">
									{ sections.map( (section, i) => 
										<Section section={section} key={`section${i}`} index={i}/>
									) }
								</div>
							</main>
						</div>
					</div>
					<div className="pure-u-1-12"></div>
				</div>
			</div>
		);
	}
}

class SideBar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			itemSelected: 0
		}
	}

	handleClickFactory(index) {
		return () => {
			this.setState({
				itemSelected: index
			})
		}
	}

	render() {
		const { itemSelected } = this.state;
		const items = this.props.titles.map( (title, i) => 
			<SideBarItem key={`title${i}`} title={title} selected={i===itemSelected} onClick={this.handleClickFactory(i)}/>
		);
		return (
			<nav id="navbar" className="pure-menu custom-restricted-width">
				<header className="pure-menu-heading">Topics</header>
				<ul className="pure-menu-list">
					{items}
				</ul>
			</nav>
		)
	}
}

class SideBarItem extends Component {
	render() {
		const { selected } = this.props;
		const title = this.props.title.replace('.', '');
		const maxTLength = 20;
		return (
			<li className={`pure-menu-item ${ selected ? "pure-menu-selected": "" }`}>
				<a 
				className="pure-menu-link nav-link" 
				onClick={this.props.onClick}
				href={`#${title.replace('.', '').replace(" ", "_")}`}
				>
					{ title.length > maxTLength ? `${title.substr(0, maxTLength-2)}...` : title}
				</a>
			</li>
		)
	}
}


class Section extends Component {
	render() {
		const { section, index } = this.props;
		return (
			<section className="main-section" id={section.title.replace('.', '').replace(" ", "_")} key={`p${index}`}>
				<header><h1>{section.title.replace('.', '')}</h1></header>
				{ section.paragraphs.map( (paragraph, i) => (
					<div key={`sectionContent${i}`}>
						<p>{paragraph.text}</p>
					</div>
				) )}
				<ul>
					{ section.bulletpoints.map( (bulletpoint, i) => (
						<li key={`${section.title.replace(" ", "_")}${i}`}>
							{bulletpoint.text}
						</li>
					) )}
				</ul>
			</section>
		)
	}
}


function randomIntBetween ( max, min ) {
	return Math.round(Math.random()*(max-min)+min);
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