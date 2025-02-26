package com.tiduswr.movies_server.util;

import java.io.InputStream;

import org.bytedeco.ffmpeg.global.avutil;
import org.bytedeco.javacv.FFmpegFrameGrabber;

import com.tiduswr.movies_server.models.dto.VideoValidated;

public class Util {
    
    public static VideoValidated checkVideo(InputStream file) {
        avutil.av_log_set_level(avutil.AV_LOG_QUIET);
        try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(file)) {
            grabber.start();

            long totalFrames = grabber.getLengthInFrames();
            double frameRate = grabber.getFrameRate();
            
            if (frameRate > 0) {
                double durationInSeconds = totalFrames / frameRate;

                long minutes = (long) (durationInSeconds / 60);
                long seconds = (long) (durationInSeconds % 60);

                return new VideoValidated(String.format("%02d:%02d", minutes, seconds), true);
            } else {
                throw new Exception("Frame rate inválido");
            }

        } catch (Exception e) {
            return new VideoValidated("??:??", false);
        }
    }
}
