import generator from './parser/generator';

const fetchAll = async () => {
  await generator.missionsFromRedditLaunches();
  await generator.missionsFromRedditUpcomingLaunchesManifest();
  await generator.missionsFromRedditPastLaunchesManifest(true);
  await generator.orbitsFromRedditLaunchesManifest(true);
};

fetchAll().catch(console.error);
