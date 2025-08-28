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

	 const [videoLoading, setVideoLoading] = React.useState(Array(highlights.length).fill(true));

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
						 <div style={{ padding: "16px 32px", boxSizing: "border-box" }}>
							 <div style={{ position: "relative" }}>
								 {videoLoading[idx] && (
									 <div style={{
										 position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
										 display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", zIndex: 2
									 }}>
										 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
									 </div>
								 )}
								 <video
									 src={item.video}
									 poster={item.poster}
									 autoPlay
									 muted
									 loop
									 playsInline
									 style={{ width: "100%", aspectRatio: "9/16", borderRadius: 12, background: "#000" }}
									 onLoadedData={() => {
										 setVideoLoading((prev) => {
											 const updated = [...prev];
											 updated[idx] = false;
											 return updated;
										 });
									 }}
								 />
							 </div>
							 <h3 className="mt-4 text-lg font-bold text-center">{item.title}</h3>
							 <p className="text-sm text-center text-gray-600">{item.description}</p>
						 </div>
					 </div>
				 ))}
			 </Slider>
		 </div>
	 );
}
