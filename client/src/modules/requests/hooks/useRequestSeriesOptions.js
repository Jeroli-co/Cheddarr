import { useEffect, useState } from "react";

const useRequestSeriesOptions = (series) => {
  const [request, setRequest] = useState(null);

  useEffect(() => {
    if (series) {
      setRequest({
        tvdb_id: series.tvdb_id,
        series_type: series.series_type,
        seasons: [],
      });
    }
  }, [series]);

  const addSeasons = (season_number) => {
    const seasons = request.seasons;

    // No seasons in array
    if (seasons.length === 0) {
      seasons.push({ season_number: season_number, episodes: [] });
    }

    const season = seasons.find((s) => s.season_number === season_number);
    // Seasons in array
    if (season) {
      season.episodes = [];
    }
    // Not in array
    else {
      seasons.push({ season_number: season_number, episodes: [] });
    }

    setRequest({ ...request, seasons: seasons });
  };

  const removeSeasons = (season_number) => {
    const seasons = request.seasons.filter(
      (season) => season.season_number !== season_number
    );
    setRequest({ ...request, seasons: seasons });
  };

  const addEpisode = (season_number, episode_number) => {
    const seasons = request.seasons;
    const season = seasons.find((s) => s.season_number === season_number);
    if (season) {
      season.episodes.push({ episode_number: episode_number });
    } else {
      seasons.push({
        season_number: season_number,
        episodes: [{ episode_number: episode_number }],
      });
    }
    setRequest({ ...request, seasons: seasons });
  };

  const removeEpisode = (season_number, episode_number) => {
    const seasons = request.seasons;
    let seasonToDeleteIndex = -1;
    seasons.forEach((season, index) => {
      if (season.season_number === season_number) {
        season.episodes = season.episodes.filter(
          (e) => e.episode_number !== episode_number
        );
        if (season.episodes.length === 0) {
          seasonToDeleteIndex = index;
        }
      }
    });
    if (seasonToDeleteIndex >= 0) {
      seasons.splice(seasonToDeleteIndex, 1);
    }
    setRequest({ ...request, seasons: seasons });
  };

  const isSeasonSelected = (season_number) => {
    const season = request.seasons.find(
      (season) =>
        season.season_number === season_number && season.episodes.length === 0
    );
    return season !== undefined;
  };

  const isEpisodeSelected = (season_number, episode_number) => {
    const season = request.seasons.find(
      (season) => season.season_number === season_number
    );
    if (season) {
      const episode = season.episodes.find(
        (e) => e.episode_number === episode_number
      );
      return episode !== undefined;
    }
    return false;
  };

  return {
    request,
    addSeasons,
    removeSeasons,
    addEpisode,
    removeEpisode,
    isSeasonSelected,
    isEpisodeSelected,
  };
};

export { useRequestSeriesOptions };
