import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import SideNav from "@/components/SideNav";
import DiaryPage from "@/pages/DiaryPage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import PostPage from "@/pages/PostPage";

function App() {
	return (
		<div className="app-shell">
			<div className="app-layout">
				<SideNav />
				<div className="app-content">
					<header className="app-header">
						<h1>Levnadsglad</h1>
						<p className="tagline">Dagböcker och textsamlingar av Ninna Kallin</p>
					</header>
					<main className="app-main">
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/post/:slug" element={<PostPage />} />
							<Route path="/diary/:categorySlug" element={<DiaryPage />} />
							<Route path="*" element={<NotFoundPage />} />
						</Routes>
					</main>
				</div>
			</div>
			<Toaster
				position="top-center"
				toastOptions={{
					duration: 2500,
					style: {
						background: "#222",
						color: "#fff",
						borderRadius: "12px",
						padding: "10px 14px",
					},
				}}
			/>
		</div>
	);
}

export default App;
