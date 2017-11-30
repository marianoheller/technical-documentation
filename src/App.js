import React, { Component } from 'react';
import loremIpsum from 'lorem-ipsum';
import VisibilitySensor from 'react-visibility-sensor';
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
			visibility: new Array(config.cantSections).fill(false),
		}
	}

	componentWillMount() {
		this.setState({
			sections: this.generateDocs(),
		})
	}


	generateDocs() {
		const { paragraphs, bulletpoints, code } = config.section;
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
			})),
			code: (new Array(randomIntBetween(code.max, code.min))).fill(0).map( () => ({
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

	onVisChangeFactory(index) {
		return (isVisible) => {
			 this.setState({
				...this.state,
				visibility: this.state.visibility.map( (e,i) => index===i ? isVisible : e )
			}) 
		}
	}

	render() {
		const { sections, visibility } = this.state;
		const titles = sections.map( (section) => section.title );
		const indexVisible = visibility.findIndex( e => e );
		return (
			<div className="App" >
				<div className="pure-g" >
					<div className="pure-u-1-12"></div>
					<div className="pure-u-10-12">
						<div className="pure-g">
							<main id="main-doc"  >
								<div className="pure-u-1-8">
									<SideBar titles={titles} itemVisible={indexVisible}/>
								</div>
								<div className="pure-u-7-8">
									{ sections.map( (section, i) => 
										<Section section={section} key={`section${i}`} index={i} onVisChange={this.onVisChangeFactory(i)}/>
									) }
								</div>
								<div id="footer">
									<div className="pure-u-1">
										<p>by <a id="github-link" href="https://github.com/marianoheller">Mariano Heller</a></p>
									</div>
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

	componentWillReceiveProps(nextProps) {
		const { itemVisible } = nextProps;
		if ( itemVisible !== -1 ) {
			this.setState({
				itemSelected: itemVisible
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

	constructor(props) {
		super(props);

		this.state = {
			content: null
		}
	}

	shuffleContent( paragraphs, bulletpoints, code ) {
		const shuffle = (a) => {
			for (let i = a.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[a[i], a[j]] = [a[j], a[i]];
			}
			return a;
		}
		const content = [paragraphs.shift()];
		content.push( ...shuffle([...paragraphs, bulletpoints, ...code]))
		return content;
	}

	componentDidMount() {

		const { section, index, onVisChange } = this.props;
		const paragraphs = section.paragraphs.map( (paragraph, i) => (
			<div key={`sectionContent${i}`}>
				<p>{paragraph.text}</p>
			</div>
		) );
		const bulletpoints = <ul key="bulletpoints">
			{ section.bulletpoints.map( (bulletpoint, i) => (
				<li key={`${section.title.replace(" ", "_")}${i}`}>
					{bulletpoint.text}
				</li>
			) )}
		</ul>
		const code = section.code.map( (code, i) => (
			<code key={`sectionCode${i}`}>
				<p>{code.text}</p>
			</code>
		) );

		this.setState( {
			content: this.shuffleContent( paragraphs, bulletpoints, code)
		})
	}

	render() {
		const { section, index, onVisChange } = this.props;
		const { content } = this.state;

		return (
			<section className="main-section" id={section.title.replace('.', '').replace(" ", "_")} key={`p${index}`}>
				<VisibilitySensor onChange={onVisChange} />
				<header><h1>{section.title.replace('.', '')}</h1></header>
				{ content }
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