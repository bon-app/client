package life.bonapp.app;

import android.app.*;
import android.content.*;
import android.media.MediaRecorder;
import android.os.*;
import androidx.core.app.NotificationCompat;
import java.io.File;
import java.util.Locale;

/** Owns the microphone independently of the WebView and stops after five recorded minutes. */
public class RecipeRecorderService extends Service {
    static final String PREFS = "recipe_recorder", CHANNEL = "recipe_recording";
    static volatile RecipeRecorderService current;
    private MediaRecorder recorder;
    private Handler timer = new Handler(Looper.getMainLooper());
    private PowerManager.WakeLock wakeLock;
    private RecordingClock clock;
    private boolean paused, warned, finished;
    private String path;
    String owner;
    private final Runnable tick = new Runnable() {
        @Override public void run() {
            if (finished) return;
            long elapsed = elapsed();
            persist(paused ? "paused" : "recording", elapsed, null);
            if (clock.takeWarning(SystemClock.elapsedRealtime())) {
                warned = true;
                Vibrator vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
                if (vibrator != null && vibrator.hasVibrator()) {
                    if (Build.VERSION.SDK_INT >= 26) vibrator.vibrate(VibrationEffect.createOneShot(400, VibrationEffect.DEFAULT_AMPLITUDE));
                    else vibrator.vibrate(400);
                }
            }
            if (elapsed >= 300000) { finishRecording(); return; }
            ((NotificationManager) getSystemService(NOTIFICATION_SERVICE)).notify(42, notification(elapsed));
            timer.postDelayed(this, 1000);
        }
    };
    @Override public void onCreate() {
        super.onCreate(); current = this;
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= 26) nm.createNotificationChannel(new NotificationChannel(CHANNEL, "Recipe recording", NotificationManager.IMPORTANCE_LOW));
    }
    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent == null ? "" : intent.getAction();
        if ("stop".equals(action)) { finishRecording(); return START_NOT_STICKY; }
        if (recorder != null) return START_NOT_STICKY;
        owner = intent == null ? "" : intent.getStringExtra("owner");
        startForeground(42, notification(0));
        try {
            File dir = new File(getFilesDir(), "recipe-recordings");
            if (!dir.exists() && !dir.mkdirs()) throw new IllegalStateException("Unable to create recording directory");
            path = new File(dir, "recipe-" + System.currentTimeMillis() + ".m4a").getAbsolutePath();
            recorder = Build.VERSION.SDK_INT >= 31 ? new MediaRecorder(this) : new MediaRecorder();
            recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
            recorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
            recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
            recorder.setAudioEncodingBitRate(64000);
            recorder.setAudioSamplingRate(44100);
            recorder.setAudioChannels(1);
            recorder.setMaxDuration(300000);
            recorder.setOutputFile(path);
            recorder.setOnErrorListener((mediaRecorder, what, extra) -> finishWithError("Recording interrupted"));
            recorder.setOnInfoListener((mediaRecorder, what, extra) -> { if (what == MediaRecorder.MEDIA_RECORDER_INFO_MAX_DURATION_REACHED) finishRecording(); });
            recorder.prepare(); recorder.start();
            PowerManager power = (PowerManager) getSystemService(POWER_SERVICE);
            wakeLock = power.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "Bonapp:RecipeRecording");
            wakeLock.acquire(6 * 60 * 1000L);
            clock = new RecordingClock(SystemClock.elapsedRealtime()); paused = false; finished = false;
            persist("recording", 0, null); timer.post(tick);
        } catch (Exception e) { persist("error", 0, "Unable to start recording"); release(); stopSelf(); }
        return START_NOT_STICKY;
    }
    private long elapsed() { return clock == null ? 0 : clock.elapsed(SystemClock.elapsedRealtime()); }
    void pauseRecording() {
        if (recorder == null || paused || finished) return;
        try { recorder.pause(); clock.pause(SystemClock.elapsedRealtime()); paused = true; if (wakeLock != null && wakeLock.isHeld()) wakeLock.release(); persist("paused", elapsed(), null); }
        catch (RuntimeException e) { finishWithError("Recording interrupted"); }
    }
    void resumeRecording() {
        if (recorder == null || !paused || finished) return;
        try { if (wakeLock != null && !wakeLock.isHeld()) wakeLock.acquire(6 * 60 * 1000L); recorder.resume(); clock.resume(SystemClock.elapsedRealtime()); paused = false; persist("recording", elapsed(), null); }
        catch (RuntimeException e) { finishWithError("Recording interrupted"); }
    }
    void finishRecording() {
        if (finished || recorder == null) return;
        long duration = elapsed(); finished = true;
        try { recorder.stop(); persist("stopped", duration, null); }
        catch (RuntimeException e) { if (path != null) new File(path).delete(); persist("error", duration, "Recording could not be saved"); }
        release(); stopForeground(true); stopSelf();
    }
    private void finishWithError(String message) {
        if (recorder != null) { try { recorder.stop(); persist("stopped", elapsed(), message); } catch (RuntimeException e) { persist("error", elapsed(), message); } }
        finished = true; release(); stopForeground(true); stopSelf();
    }
    private void release() {
        timer.removeCallbacks(tick);
        if (recorder != null) { recorder.release(); recorder = null; }
        if (wakeLock != null && wakeLock.isHeld()) wakeLock.release();
        current = null;
    }
    private void persist(String state, long duration, String error) {
        getSharedPreferences(PREFS, MODE_PRIVATE).edit().putString("state." + owner, state).putString("path." + owner, path).putLong("duration." + owner, duration).putString("error." + owner, error).apply();
    }
    private Notification notification(long ms) {
        Intent stop = new Intent(this, RecipeRecorderService.class).setAction("stop");
        PendingIntent action = PendingIntent.getService(this, 42, stop, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        PendingIntent open = PendingIntent.getActivity(this, 43, new Intent(this, MainActivity.class), PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        boolean it = getSharedPreferences(PREFS, MODE_PRIVATE).getString("language." + owner, "en").equals("it");
        String title = it ? "Registrazione ricetta" : "Recording your recipe";
        String warning = it ? "Resta solo 1 minuto" : "Only 1 minute left";
        String time = String.format(Locale.ROOT, "%02d:%02d / 05:00", ms / 60000, (ms / 1000) % 60);
        String state = paused ? (it ? "In pausa · " : "Paused · ") : "";
        return new NotificationCompat.Builder(this, CHANNEL).setSmallIcon(getApplicationInfo().icon).setContentTitle(title)
            .setContentText(state + (warned ? warning + " · " + time : time)).setOngoing(true).setOnlyAlertOnce(true).setContentIntent(open)
            .addAction(0, it ? "Interrompi" : "Stop", action).build();
    }
    @Override public void onDestroy() {
        if (!finished && recorder != null) finishWithError("Recording interrupted");
        release(); super.onDestroy();
    }
    @Override public IBinder onBind(Intent intent) { return null; }
}
