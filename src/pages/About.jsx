import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ExecomPoster from '../components/execom/ExecomPoster';
import api from '../services/api';

// About page with correct JSX structure and SEO tags
export default function About() {
	const [members, setMembers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		let ignore = false;
		async function loadMembers() {
			try {
				setLoading(true);
				const res = await api.get('/achievements/execom-members/');
				if (!ignore) setMembers(res.data || []);
			} catch (e) {
				if (!ignore) setError('Failed to load Execom members');
			} finally {
				if (!ignore) setLoading(false);
			}
		}
		loadMembers();
		return () => { ignore = true; };
	}, []);

	return (
		<>
			<Helmet>
				<title>About | SAE TKMCE</title>
				<meta name="description" content="Learn about SAE TKMCE, our mission, chapter info, executive committee, and our commitment to hands-on engineering and student development." />
			</Helmet>
			<div className="bg-white">
				<section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 text-white">
					<div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8">
						<div className="max-w-2xl">
							<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">About SAE TKMCE</h1>
							<p className="mt-6 text-lg text-indigo-100">
								We are the SAE Collegiate Club at TKM College of Engineering—
								a student-driven community focused on hands-on engineering, tech events,
								competitions, and industry collaboration.
							</p>
						</div>
					</div>
				</section>
				<section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
					<div className="grid grid-cols-1 gap-10 md:grid-cols-2">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
							<p className="mt-4 text-gray-600">
								Foster practical engineering skills, promote innovation, and build a
								collaborative community through workshops, talks, projects, and competitions.
							</p>
						</div>
						<div>
							<h2 className="text-2xl font-bold text-gray-900">What We Do</h2>
							<ul className="mt-4 list-inside list-disc text-gray-600">
								<li>Host technical workshops and hands-on sessions</li>
								<li>Organize speaker sessions and industry interactions</li>
								<li>Run events and challenges for students</li>
								<li>Collaborate on projects and competitions</li>
							</ul>
						</div>
					</div>
					<h2 className="mt-12 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 text-center">
						Execom Members
					</h2>
					<div className="mt-8">
						{loading ? (
							<div className="text-center text-gray-600">Loading Execom members…</div>
						) : error ? (
							<div className="text-center text-red-600">{error}</div>
						) : (
							<ExecomPoster members={members} />
						)}
					</div>
				</section>
			</div>
		</>
		);
	}

