import Atom from "@/components/core/components/AtomLoading";
import React from "react";

const Unauthorize: React.FC = () => {
	return (
		<div className="h-screen flex flex-col items-center justify-center">
			<div className="mt-10 flex flex-col items-center">
				<Atom size={200} color="#FC0101" animationDuration="700" />
				{!token ? (
					<button
						className="bg-[#e59a1b] hover:bg-[#cb7614] text-[#713716] hover:text-[#faf1cb] mt-5 px-4 py-2 rounded-md text-lg font-semibold cursor-pointer"
						onClick={handleLogin}
					>
						Đăng nhập
					</button>
				) : null}
			</div>
		</div>
	)
};

export default Unauthorize;