package life.bonapp.app;

import android.Manifest;
import android.content.*;
import android.os.Build;
import android.os.SystemClock;
import android.content.pm.PackageManager;
import android.net.Uri;
import com.getcapacitor.*;
import com.getcapacitor.annotation.*;
import java.io.File;

@CapacitorPlugin(name = "RecipeRecorder", permissions = {
    @Permission(alias = "microphone", strings = { Manifest.permission.RECORD_AUDIO }),
    @Permission(alias = "notifications", strings = { Manifest.permission.POST_NOTIFICATIONS })
})
public class RecipeRecorderPlugin extends Plugin {
    private String owner(PluginCall call) {
        String value = call.getString("owner", "");
        return value.matches("[0-9a-fA-F]{24}") ? value.toLowerCase() : "";
    }
    @PluginMethod public void start(PluginCall call) {
        if (getPermissionState("microphone") != PermissionState.GRANTED) { requestPermissionForAlias("microphone", call, "microphoneResult"); return; }
        afterMicrophone(call);
    }
    @PermissionCallback private void microphoneResult(PluginCall call) {
        if (getPermissionState("microphone") != PermissionState.GRANTED) { call.reject("Microphone permission denied"); return; }
        afterMicrophone(call);
    }
    private void afterMicrophone(PluginCall call) {
        if (Build.VERSION.SDK_INT >= 33 && getPermissionState("notifications") == PermissionState.PROMPT) { requestPermissionForAlias("notifications", call, "notificationResult"); return; }
        begin(call);
    }
    @PermissionCallback private void notificationResult(PluginCall call) { begin(call); }
    private void begin(PluginCall call) {
        String owner = owner(call);
        if (owner.isEmpty()) { call.reject("A signed-in account is required"); return; }
        if (RecipeRecorderService.current != null) { call.reject("A recording is already active"); return; }
        String language = call.getString("language", "en");
        getContext().getSharedPreferences(RecipeRecorderService.PREFS, Context.MODE_PRIVATE).edit().putString("language." + owner, language).putString("state." + owner, "starting").putLong("startingAt." + owner, SystemClock.elapsedRealtime()).putLong("duration." + owner, 0).apply();
        try {
            Intent intent = new Intent(getContext(), RecipeRecorderService.class).setAction("start").putExtra("owner", owner);
            if (Build.VERSION.SDK_INT >= 26) getContext().startForegroundService(intent); else getContext().startService(intent);
            call.resolve();
        } catch (Exception e) { call.reject("Unable to start recording", e); }
    }
    @PluginMethod public void pause(PluginCall call) { getActivity().runOnUiThread(() -> { if (RecipeRecorderService.current != null && owner(call).equals(RecipeRecorderService.current.owner)) RecipeRecorderService.current.pauseRecording(); call.resolve(); }); }
    @PluginMethod public void resume(PluginCall call) { getActivity().runOnUiThread(() -> { if (RecipeRecorderService.current != null && owner(call).equals(RecipeRecorderService.current.owner)) RecipeRecorderService.current.resumeRecording(); call.resolve(); }); }
    @PluginMethod public void stop(PluginCall call) { getActivity().runOnUiThread(() -> { if (RecipeRecorderService.current != null && owner(call).equals(RecipeRecorderService.current.owner)) RecipeRecorderService.current.finishRecording(); call.resolve(); }); }
    @PluginMethod public void status(PluginCall call) {
        SharedPreferences prefs = getContext().getSharedPreferences(RecipeRecorderService.PREFS, Context.MODE_PRIVATE);
        String owner = owner(call); if (owner.isEmpty()) { call.reject("A signed-in account is required"); return; }
        String state = prefs.getString("state." + owner, "idle");
        if ((RecipeRecorderService.current == null || !owner.equals(RecipeRecorderService.current.owner)) && (state.equals("recording") || state.equals("paused"))) state = "interrupted";
        if (RecipeRecorderService.current == null && state.equals("starting") && SystemClock.elapsedRealtime() - prefs.getLong("startingAt." + owner, 0) > 10000) state = "interrupted";
        JSObject result = new JSObject(); result.put("state", state); result.put("duration", prefs.getLong("duration." + owner, 0));
        result.put("error", prefs.getString("error." + owner, ""));
        result.put("notificationsAllowed", Build.VERSION.SDK_INT < 33 || getContext().checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED);
        call.resolve(result);
    }
    @PluginMethod public void read(PluginCall call) {
        String owner = owner(call); if (owner.isEmpty()) { call.reject("A signed-in account is required"); return; }
        String path = getContext().getSharedPreferences(RecipeRecorderService.PREFS, Context.MODE_PRIVATE).getString("path." + owner, "");
        try {
            File file = new File(path), directory = new File(getContext().getFilesDir(), "recipe-recordings");
            if (!file.getCanonicalPath().startsWith(directory.getCanonicalPath() + File.separator) || !file.isFile() || file.length() > 5 * 1024 * 1024) throw new IllegalStateException("Recording unavailable");
            JSObject result = new JSObject(); result.put("path", Uri.fromFile(file).toString()); call.resolve(result);
        } catch (Exception e) { call.reject("Recording unavailable", e); }
    }
    @PluginMethod public void discard(PluginCall call) {
        if (RecipeRecorderService.current != null) { call.reject("Stop recording first"); return; }
        String owner = owner(call); if (owner.isEmpty()) { call.reject("A signed-in account is required"); return; }
        SharedPreferences prefs = getContext().getSharedPreferences(RecipeRecorderService.PREFS, Context.MODE_PRIVATE);
        String path = prefs.getString("path." + owner, "");
        try { File dir = new File(getContext().getFilesDir(), "recipe-recordings"); File file = new File(path); if (file.getCanonicalPath().startsWith(dir.getCanonicalPath() + File.separator)) file.delete(); } catch (Exception ignored) {}
        prefs.edit().remove("path." + owner).putString("state." + owner, "idle").putLong("duration." + owner, 0).remove("error." + owner).apply(); call.resolve();
    }
}
