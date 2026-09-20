package com.app.quizsystem.model;

public enum NinjaRank {
    D("Genin Academic", "Leaf Academy basic training and elementary lore"),
    C("Chūnin Selection", "Applied tactics, structured analytical problem solving"),
    B("Special Jōnin", "Specialized advanced mastery in specific jutsu domains"),
    A("Jōnin Commander", "High-complexity mission strategy and architecture"),
    S("Hokage Protocol", "Legendary mastery, foundational theory and novel solutions");

    private final String title;
    private final String description;

    NinjaRank(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }
}
