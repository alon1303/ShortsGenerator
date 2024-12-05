import {AbsoluteFill, OffthreadVideo, Sequence} from 'remotion';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import {useEffect, useState} from 'react';
import './style.css';
import {Subtitle} from '../interfaces/interfaces';
import {io} from 'socket.io-client';

export const myCompSchema = z.object({
	titleText: z.string(),
	titleColor: zColor(),
	logoColor: zColor(),
});

export const MyComposition: React.FC<z.infer<typeof myCompSchema>> = ({
	titleText: propOne,
	titleColor: propTwo,
	logoColor: propThree,
}) => {
	const socketServerUrl = 'http://localhost:4000';
	const [videoUrl, setVideoUrl] = useState<string>('');
	const [subtitles, setSubtitles] = useState<Subtitle[]>([]);

	function secondsToFrames(seconds: number) {
		const frameRate = 30;

		return Math.round(seconds * frameRate);
	}

	function updateSubtitles(subtitles: Subtitle[]): Subtitle[] {
		const updatedSubtitles: Subtitle[] = subtitles.map((subtitle) => ({
			...subtitle,
			startFrame: secondsToFrames(subtitle.startTime),
			endFrame: secondsToFrames(subtitle.endTime),
		}));
		return updatedSubtitles;
	}

	function calculateDurationInFrames(startFrame: number, endFrame: number) {
		if (endFrame - startFrame <= 0) {
			return 2;
		} else return endFrame - startFrame;
	}

	useEffect(() => {
		const socket = io(socketServerUrl, {
			transports: ['websocket'],
		});

		socket.on('newVideo', (fileName: string, subtitles: Subtitle[]) => {
			setVideoUrl(`http://localhost:8080/assets/${fileName}`);
			const updatedSubtitles = updateSubtitles(subtitles);
			setSubtitles(updatedSubtitles);
		});
		return () => {
			socket.disconnect();
		};

		// setSubtitles([
		// 	{
		// 		id: '1',
		// 		startTime: 0,
		// 		endTime: 3,
		// 		startFrame: 1,
		// 		endFrame: 90,
		// 		text: 'heyy joee',
		// 	},
		// 	{
		// 		id: '2',
		// 		startTime: 3,
		// 		endTime: 5,
		// 		startFrame: 90,
		// 		endFrame: 150,
		// 		text: 'how u doin',
		// 	},
		// ]);
	}, []);

	function createSequence(subtitle: Subtitle) {
		if (subtitle.endFrame && subtitle.startFrame) {
			return (
				<Sequence
					key={subtitle.id}
					from={subtitle.startFrame}
					durationInFrames={calculateDurationInFrames(
						subtitle.startFrame,
						subtitle.endFrame,
					)}
				>
					<div className="subtitle">{subtitle.text}</div>
				</Sequence>
			);
		}
	}
	return (
		<AbsoluteFill className="bg-gray-100 video-container">
			{videoUrl ? (
				<OffthreadVideo src={videoUrl} className='video'></OffthreadVideo>
			) : (
				<h1>Waiting for a new video...</h1>
			)}

			{/* <OffthreadVideo src="http://localhost:8080/assets/jre-clip1.mp4"></OffthreadVideo> */}

			{subtitles &&
				subtitles.map((subtitle) => {
					return createSequence(subtitle);
				})}
		</AbsoluteFill>
	);
};
