import { createTikTokStyleCaptions } from "@remotion/captions";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import SubtitlePage from "../caption/SubtitlePage";
import { animations } from "../utils/animations";

const colors = ["#FFAF2D", "#19E508", "#FF2D73", "#2DFFFB"];
const randomColor = colors[Math.floor(Math.random() * colors.length)];

export const SingleAudioComposition = ({ data }) => {
  const { images, audio } = data;
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  let from = 0;
  const eachDuration = durationInFrames / images.length;
  const animKeys = Object.keys(animations);

  const { pages } = createTikTokStyleCaptions({
    combineTokensWithinMilliseconds: 300,
    captions: data.caption,
  });

  console.log("pages", pages);

  return (
    <AbsoluteFill>
      {images.map((element, index) => {
        const start = from;
        const end = from + eachDuration;
        from = end;

        const animIndex = index % animKeys.length;
        const animation = animations[animKeys[animIndex]](start, end, frame);

        return (
          <Sequence key={index} from={start} to={end}>
            <Img
              src={staticFile(`/uploads/${element}`)}
              style={{
                height: "100%",
                objectFit: "cover",
                ...animation,
              }}
            />
          </Sequence>
        );
      })}
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] || null;
        const subtitleStartFrame = (page.startMs / 1000) * fps;
        const subtitleEndFrame = nextPage ? (nextPage.startMs / 1000) * fps : durationInFrames;
        const durationInFramesSubtitle = subtitleEndFrame - subtitleStartFrame;
        if (durationInFramesSubtitle <= 0) {
          return null;
        }
        return (
          <Sequence key={index} from={subtitleStartFrame} durationInFrames={durationInFramesSubtitle}>
            <SubtitlePage page={page} color={randomColor} />
          </Sequence>
        );
      })}
      <Audio src={staticFile(`/uploads/${audio}`)} />
    </AbsoluteFill>
  );
};

export const calculateSingleCompositionMetadata = ({ props }) => {
  const totalDurationMs = props.data.duration;
  const totalDurationSeconds = totalDurationMs / 1000;
  const fps = 30;
  return {
    durationInFrames: Math.ceil(totalDurationSeconds * fps),
    fps,
    width: 1080,
    height: 1920,
  };
};
