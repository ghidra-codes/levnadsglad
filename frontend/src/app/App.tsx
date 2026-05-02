import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import decorBottom from "@/assets/svgs/decor-bottom.svg";
import decorTop from "@/assets/svgs/decor-top.svg";
import SideNav from "@/components/SideNav";
import DiaryPage from "@/pages/DiaryPage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import PostPage from "@/pages/PostPage";

function App() {
	return (
		<div className="app-shell">
			<div className="app-decor">
				<img src={decorTop} className="app-decor__top" alt="" />
			</div>

			<header className="app-header">
				<h1>Levnadsglad</h1>
				<p className="tagline">Dagböcker och textsamlingar av Ninna Kallin</p>
			</header>

			<div className="app-layout">
				<SideNav />

				<div className="app-content">
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

			<div className="app-decor">
				<img src={decorBottom} className="app-decor__bottom" alt="" />
			</div>

			<Toaster
				position="top-center"
				toastOptions={{
					duration: 2500,
					style: {
						background: "rgba(255, 255, 255, 0.85)",
						color: "#2f2a26",
						border: "1px solid #e7e3dc",
						borderRadius: "10px",
						padding: "10px 14px",
						boxShadow: "0 6px 16px rgba(47, 42, 38, 0.06)",
						backdropFilter: "blur(6px)",
					},
				}}
			/>
		</div>
	);
}

export default App;
