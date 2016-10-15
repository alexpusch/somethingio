defmodule Somethingio.RandomName do
  def generate do
    verbs = ["good", "new", "first", "last", "long", "great", "little", "own", "other", "old"]
    nouns = ["people", "history", "way", "art", "world", "information", "map", "two", "family", "government", "health", "system", "computer"]

    verb = Enum.random verbs
    noun = Enum.random nouns

    verb <> " " <> noun
  end
end

