import {AbsoluteFill, OffthreadVideo, Sequence, Video} from 'remotion';

import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import './style.css';
import {Subtitle} from '../interfaces/interfaces';

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
					<div className="sequence">{subtitle.text}</div>
				</Sequence>
			);
		}
	}
	return (
		<AbsoluteFill className="bg-gray-100 container-1">
			{/* {videoUrl ? (
				<OffthreadVideo src={videoUrl}></OffthreadVideo>
			) : (
				<h1>Waiting for a new video...</h1>
			)} */}

			{/* {subtitles &&
				subtitles.map((subtitle) => {
					return createSequence(subtitle);
				})} */}

				<OffthreadVideo src='http://localhost:8080/assets/jre-clip1.mp4'></OffthreadVideo>
				<div className='subtitle'>dsnajidbasu</div>
		</AbsoluteFill>
	);
};
