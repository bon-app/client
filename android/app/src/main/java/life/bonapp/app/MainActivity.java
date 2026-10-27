package life.bonapp.app;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;

public class MainActivity extends BridgeActivity {
    @Override public void onCreate(Bundle savedInstanceState) {
        registerPlugin(RecipeRecorderPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
