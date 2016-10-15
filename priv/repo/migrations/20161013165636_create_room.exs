defmodule Somethingio.Repo.Migrations.CreateRoom do
  use Ecto.Migration

  def change do
    create table(:rooms) do
      add :players_count, :integer
      add :name, :string

      timestamps()
    end

  end
end
