/** This represents a search result article item in the search bar window.*/
/* eslint-disable react/prop-types */
import React, {useState} from "react";
import {Link} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";

const ArticleSearchItem = (props) => {
	const [readMore, setReadMore] = useState(false);

	const extraContent = (
		<div>
			<p className="extra-content">
				{/* eslint-disable-next-line react/prop-types */}
				{props.text}
			</p>
		</div>
	);

	const linkName = readMore ? "Read Less << " : "Read More >> ";

	return (		
		<li key={props.id}>
			<Container>
				<Row>
					<Col>
						{/* eslint-disable-next-line react/prop-types */}
						<img src={props.image} alt="article graphics"/>
					</Col>
					<Col>
						<Row>
							<Col>
								<Row>
									{/* eslint-disable-next-line react/prop-types */}
									<h3>Title: {props.title || "Article title..."}</h3>
									<br/>
								</Row>
								<Row>
									{/* eslint-disable-next-line react/prop-types */}
												Description: {props.description || "Article description..."}
									<br/>
								</Row>
								<Row style={{display: "flex"}}>
									<Link to={""} onClick={() => {
										setReadMore(!readMore);
									}}>
										{linkName}
									</Link>
									<br/>
									{readMore && extraContent}
									<br/>
	
									{/* eslint-disable-next-line react/prop-types */}
									<Link onClick={props.handleClose} to={`/article/${props.slug}`}>
										Full article page
									</Link>
								</Row>
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
			<br/>
		</li>		
	);
};

export default ArticleSearchItem;

