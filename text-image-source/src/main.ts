import { createTextImage } from "./";

const cvs = document.createElement("canvas");
document.body.appendChild(cvs);

createTextImage({
	canvas: cvs,
	// 可选，配置作画半径，该值越大越稀疏，默认为 10
	raduis: 6,
	// 可选，配置是否灰度化，若开启灰度化则会丢失色彩，默认为 false
	isGray: true,
	source: {
		text: "DUYI",
		// img: "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0286ee28813f4b3d9d105dca69315ffc~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?",
		// video: "../public/1.mp4",
		// width: 200,
		// height: 400,
	},
	replaceText: "*",
});
