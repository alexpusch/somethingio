defmodule Somethingio.Repo.Migrations.CreatePlayer do
  use Ecto.Migration

  def change do
    create table(:players) do
      add :name, :string
      add :score, :integer

      add :room_id, references(:rooms)

      timestamps()
    end

  end
end
