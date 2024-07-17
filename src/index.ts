import { Extension } from "@codemirror/state";
import { Plugin } from "obsidian";
import { headingMarkerPlugin } from "./headingWidget";
import { DEFAULT_SETTINGS, LapelSettings, LapelSettingsTab } from "./settings";

export default class LapelPlugin extends Plugin {
  public settings: LapelSettings;
  private extensions: Extension[] = [];

  async onload(): Promise<void> {
    await this.loadSettings();
    this.extensions.push(headingMarkerPlugin(this.settings.showBeforeLineNumbers));
    this.registerEditorExtension(this.extensions);
    this.registerSettingsTab();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  private registerSettingsTab() {
    this.addSettingTab(new LapelSettingsTab(this.app, this));
  }

  public async updateSettings(
    tx: (old: LapelSettings) => Partial<LapelSettings>
  ): Promise<void> {
    const changedSettings = tx(this.settings);
    const newSettings = Object.assign({}, this.settings, changedSettings);
    if (this.settings.showBeforeLineNumbers !== changedSettings.showBeforeLineNumbers) {
      const updatedExt = headingMarkerPlugin(newSettings.showBeforeLineNumbers);
      this.extensions[0] = updatedExt;
      this.app.workspace.updateOptions();
    }

    this.settings = newSettings;
    await this.saveData(this.settings);
  }
}
