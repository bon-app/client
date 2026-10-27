package life.bonapp.app;
import org.junit.Test;
import static org.junit.Assert.*;

public class RecordingClockTest {
    @Test public void warnsOnceAtFourMinutesAndStopsAtFive() {
        RecordingClock clock = new RecordingClock(1000);
        assertFalse(clock.takeWarning(240999));
        assertTrue(clock.takeWarning(241000));
        assertFalse(clock.takeWarning(242000));
        assertFalse(clock.expired(300999));
        assertTrue(clock.expired(301000));
        assertEquals(300000, clock.elapsed(350000));
    }
    @Test public void excludesPausedTimeAcrossMultipleSegments() {
        RecordingClock clock = new RecordingClock(0);
        clock.pause(120000);
        assertEquals(120000, clock.elapsed(600000));
        assertFalse(clock.takeWarning(600000));
        clock.resume(600000);
        assertTrue(clock.takeWarning(720000));
        clock.pause(750000);
        assertFalse(clock.expired(2000000));
        clock.resume(2000000);
        assertTrue(clock.expired(2030000));
    }
}
