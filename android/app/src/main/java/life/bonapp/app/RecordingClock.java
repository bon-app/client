package life.bonapp.app;

/** Measures recorded time independently of the activity, excluding pauses. */
final class RecordingClock {
    private long accumulated, start;
    private boolean paused, warned;
    RecordingClock(long now) { start = now; }
    long elapsed(long now) { return Math.min(300000, accumulated + (paused ? 0 : Math.max(0, now - start))); }
    void pause(long now) { if (!paused) { accumulated = elapsed(now); paused = true; } }
    void resume(long now) { if (paused) { start = now; paused = false; } }
    boolean takeWarning(long now) { if (!warned && elapsed(now) >= 240000) { warned = true; return true; } return false; }
    boolean expired(long now) { return elapsed(now) >= 300000; }
}
