import {Sequence} from 'remotion';
import {Subtitle} from '../interfaces/interfaces';
import './style.css';
import {useEffect, useState} from 'react';

export const Captions = (fetched_subtitles: Subtitle[]) => {
	const [subtitles, setSubtitles] = useState<Subtitle[]>(fetched_subtitles);
	function calculateDurationInFrames(startFrame: number, endFrame: number) {
		if (endFrame - startFrame <= 0) {
			return 2;
		} else return endFrame - startFrame;
	}
	function secondsToFrames(seconds: number) {
		const frameRate = 30;

		return Math.round(seconds * frameRate);
	}
	function updateSubtitles(subtitles: Subtitle[]) {
		setSubtitles((prevSubtitles) =>
			prevSubtitles.map((subtitle) => ({
				...subtitle,
				startFrame: secondsToFrames(subtitle.startTime),
				endFrame: secondsToFrames(subtitle.endTime),
			})),
		);
	}

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
	useEffect(() => {
		updateSubtitles(fetched_subtitles);
	}, []);
	return subtitles.map((subtitle) => {
		return createSequence(subtitle);
	});
};
