import generator from './parser/generator';

const fetchAll = async () => {
  // await generator.padsFromRedditPads();
  // await generator.orbitsFromRedditLaunchesManifest();
  // await generator.missionsFromRedditLaunches();
  // await generator.missionsFromRedditUpcomingLaunchesManifest();
  // await generator.missionsFromRedditPastLaunchesManifest();
  await generator.coresFromRedditCores();
};

fetchAll().catch(console.error);
