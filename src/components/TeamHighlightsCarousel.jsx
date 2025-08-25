import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useRef } from "react";

// Example team highlight data
const highlights = [
	{
		title: "VEGHA TKMCE",
		description: "Green Hybrid Automotive Innovations.",
		video: "/videos/vegha-highlight.mp4",
		poster: "/images/teams/veghalogo.png",
	},
	{
		title: "DRONA TKMCE",
		description: "Drona SAE Team in action.",
		video: "/videos/drona-highlight.mp4",
		poster: "/images/teams/DRONA_LW.png",
	},
	{
		title: "XLR8 Racing TKMCE",
		description: "Formula SAE Racing Team moments.",
		video: "/videos/xlr8-highlight.mp4",
		poster: "/images/teams/xlr8-racing.png",
	},
	{
		title: "XLR8FST TKMCE",
		description: "Formula Student Racing Team .",
		video: "/videos/xlr8fst-highlight.mp4",
		poster: "/images/teams/xlr8-fst.png",
	},
	{
		title: "AeroSAE TKMCE",
		description: "Fixed Wing UAV Team moments.",
		video: "/videos/aerex-highlight.mp4",
		poster: "/images/teams/Aerex-logo.png",
	},
	{
		title: "SPOX TKMCE",
		description: "Bicycle Design Team.",
		video: "/videos/spox-highlight.mp4",
		poster: "/images/teams/SPOX-LOGO.png",
	}
];

export default function TeamHighlightsCarousel() {
	const sectionRef = useRef(null);

	useEffect(() => {
		const handleScroll = () => {
			if (!sectionRef.current) return;
			const rect = sectionRef.current.getBoundingClientRect();
			const inView = rect.top < window.innerHeight && rect.bottom > 0;
			if (inView) {
				document.body.style.transition = "background 0.5s";
				document.body.style.background = "#000";
			} else {
				document.body.style.transition = "background 0.5s";
				document.body.style.background = "";
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
			document.body.style.background = "";
		};
	}, []);

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 20000,
		centerMode: true,
		variableWidth: false,
		arrows: false,
	};

	return (
		<div
			ref={sectionRef}
			style={{
				borderRadius: "12px",
				overflow: "hidden",
				maxWidth: 600,
				margin: "0 auto",
                
			}}
		>
			<Slider {...settings}>
				{highlights.map((item, idx) => (
					<div key={idx} style={{ width: 350 }}>
						<div
							style={{
								padding: "16px 32px",
								boxSizing: "border-box",
							}}
						>
							<video
								src={item.video}
								poster={item.poster}
								autoPlay
								muted
								loop
								playsInline
								style={{
									width: "100%",
									aspectRatio: "9/16",
									borderRadius: 12,
									background: "#000",
								}}
							/>
							<h3 className="mt-4 text-lg font-bold text-center">
								{item.title}
							</h3>
							<p className="text-sm text-center text-gray-600">
								{item.description}
							</p>
						</div>
					</div>
				))}
			</Slider>
		</div>
	);
}
