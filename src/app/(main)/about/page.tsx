import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">About Pokedash</h1>
        <p className="text-muted-foreground">
          Blockchain-powered Pokemon card investment platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What is Pokedash?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Pokedash is a revolutionary blockchain-based investment platform that allows users to
            participate in the Pokemon card market without the hassle of storage, authentication, or
            sales operations.
          </p>
          <p className="text-muted-foreground">
            Users deposit funds into an on-chain vault, which is then used to purchase high-value
            Pokemon cards and operate a professional vendor business. Returns from card appreciation
            and vendor sales are distributed back to depositors, minus a small performance fee.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Deposit Funds</h3>
                <p className="text-sm text-muted-foreground">
                  Users deposit cryptocurrency into the on-chain vault and receive vault tokens
                  representing their share of the fund.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Card Acquisition</h3>
                <p className="text-sm text-muted-foreground">
                  Deposited funds are used to strategically purchase high-value, rare Pokemon cards
                  with strong appreciation potential.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Vendor Operations</h3>
                <p className="text-sm text-muted-foreground">
                  Cards are actively traded through multiple platforms (TCGPlayer, eBay, local shops)
                  to generate consistent returns.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Returns Distribution</h3>
                <p className="text-sm text-muted-foreground">
                  Profits from card appreciation and vendor sales are distributed to vault token
                  holders proportionally to their stake, minus a performance fee.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground">
                Transparent on-chain fund management and performance tracking
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground">
                Professional card authentication and storage
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground">
                Active vendor operations across multiple platforms
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground">
                Real-time analytics and historical performance data
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground">
                Automated returns distribution via smart contracts
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span className="text-muted-foreground">
                Personal vault access (coming soon) - view your share of holdings
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground">
          <p>
            This dashboard provides transparency into historical Pokemon card market performance and
            vendor operations. While the blockchain vault is still under development, this analytics
            platform demonstrates the potential returns and business model.
          </p>
          <p className="text-sm">
            All data shown is for demonstration purposes and represents typical market conditions.
            When the vault launches, this dashboard will display real-time data from the actual fund.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
