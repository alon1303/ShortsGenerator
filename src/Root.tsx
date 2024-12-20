import {Composition} from 'remotion';
import {MyComposition, myCompSchema} from './Composition';
import './style.css';
import React from "react";


export const RemotionRoot: React.FC = () => {
	
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComposition}
				durationInFrames={800}
				fps={30}
				width={1080}
				height={1920}
				schema={myCompSchema}
				defaultProps={{
					titleText: 'Welcome to Remotion with Tailwind CSS',
					titleColor: '#000000',
					logoColor: '#00bfff',
				}}
			/>
		</>
	);
};
