import { useState } from "react";
import { useNavigate} from "react-router-dom";
import { Link, Button  } from "@nextui-org/react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  GithubIcon,
  DiscordIcon,
} from "@/components/icons";

export const Navbar = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();


  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <NextUINavbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>


      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <Link isExternal href={siteConfig.links.discord} title="Discord">
        <DiscordIcon className="text-default-500" />
        </Link>
        <Link isExternal href={siteConfig.links.github} title="GitHub">
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarItem>
          <Button  variant="flat" className="mx-2" color="danger" onClick={handleLogout}>
            Logout
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {siteConfig.navItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                item.href === window.location.pathname ? "primary" : "foreground"
              }
              href={item.href}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu> 
    </NextUINavbar>
  );
};



    // <NextUINavbar maxWidth="xl" position="sticky">

    //   <NavbarContent className="basis-1/5 sm:flex sm:basis-full" justify="start">
    //     <div className="flex gap-4 justify-start ml-2">
    //       {siteConfig.navItems.map((item) => (
    //         <NavbarItem key={item.href} className="hidden">
    //           <Link
    //             className={clsx(
    //               linkStyles({ color: "foreground" }),
    //               "data-[active=true]:text-primary data-[active=true]:font-medium",
    //             )}
    //             color="foreground"
    //             href={item.href}
    //           >
    //             {item.label}
    //           </Link>
    //         </NavbarItem>
    //       ))}
    //     </div>
    //   </NavbarContent>

    //   <NavbarContent
    //     className="sm:flex basis-1/5 sm:basis-full"
    //     justify="end"
    //   >
    //     <NavbarItem className="hidden sm:flex gap-2">
    //       <Link isExternal href={siteConfig.links.discord} title="Discord">
    //         <DiscordIcon className="text-default-500" />
    //       </Link>
    //       <Link isExternal href={siteConfig.links.github} title="GitHub">
    //         <GithubIcon className="text-default-500" />
    //       </Link>
    //       <ThemeSwitch />
    //       <Button
    //         className="mx-4"
    //         color="danger"
    //         onClick={handleLogout}
    //       >
    //         Logout
    //       </Button>
    //     </NavbarItem>
    //     <NavbarMenuToggle className="sm:hidden" />
    //   </NavbarContent>
    // </NextUINavbar>