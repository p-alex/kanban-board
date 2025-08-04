import LoggedInLayout from "../components/LoggedInLayout";
import BoardsDashboard from "../components/BoardsDashboard/BoardsDashboard";

function BoardsPage() {
  return (
    <LoggedInLayout>
      <div className="mx-auto w-full max-w-[1400px] p-4 mt-6">
        <BoardsDashboard />
      </div>
    </LoggedInLayout>
  );
}

export default BoardsPage;
