import { Formik } from 'formik';
import { useState } from 'react';
import { Card , Input, Button, Link } from "@nextui-org/react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle
} from "@nextui-org/navbar";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  GithubIcon,
  DiscordIcon,
} from "@/components/icons";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);


  const apiUrl = import.meta.env.VITE_APIURL;

  return (
    <>
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/3 sm:basis-full" justify="start">
        <h1 className='text-2xl font-bold text-red-900'>GoDelyAdmin - ReadTeam</h1>
      </NavbarContent>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.discord} title="Discord">
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.github} title="GitHub">
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

    </NextUINavbar>
    <div className='w-full h-screen flex justify-center items-center'>
      <Card className='w-full max-w-md m-2 p-8'>
        <h1 className='text-red-900 font-extrabold text-3xl text-center mb-4'>Login to Access</h1>
        <Formik
          initialValues={{ email: '', password: '' }}
          validate={values => {
            const errors: { email?: string; password?: string } = {};
            if (!values.email) {
              errors.email = 'Required';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = 'Invalid email address';
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setError(null);
            console.log(values);
            try {
              const {data} = await axios.post(apiUrl + '/auth/login', values);

              console.log(data);

              sessionStorage.setItem('token', data.token);
              console.log(sessionStorage.getItem('token'));
              navigate('/products');
              // Handle successful login (e.g., redirect to another page)
            } catch (e) {
              console.log(e);
              if (e instanceof Error) {
                setError(e.message);
              } else {
                setError(String(e));
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  fullWidth
                />
                {errors.email && touched.email && <h1 className='text-red-500 text-md'>{errors.email}</h1>}
              </div>
              <div className='mb-4'>
                <Input
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  fullWidth
                />
                {errors.password && touched.password && <h1 className='text-red-500 text-md'>{errors.password}</h1>}
              </div>
              <Button type="submit" disabled={isSubmitting} className='w-full' color="success">
                {isSubmitting ? 'Loading...' : 'Submit'}
              </Button>
            </form>
          )}
        </Formik>

        {error != null ?
        <Card className='bg-red-400 mt-4'>
          <h1 className='text-white p-4'>Error: {error}</h1>
        </Card>
        : null
        }
      </Card>
    </div>
    </>
  )
}