import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Card, Input, Button, Link } from "@nextui-org/react";
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
import axios, { AxiosError } from 'axios';
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

      <div className='h-screen flex justify-center items-center'>
        <Card className='w-full max-w-md mx-2 p-8'>
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
              // console.log(values);
              try {
                const { data } = await axios.post(apiUrl + '/auth/login', values);
                // console.log(data);
                
                if (data.type !== 'ADMIN') throw new Error('You are not an admin');
                
                // Guarda el token en sessionStorage
                sessionStorage.setItem('token', data.token);

                // Verifica que el token esté guardado correctamente
                const token = sessionStorage.getItem('token');

                if (token) {
                  // Redirige a la página de productos
                  navigate('/products');
                } else {
                  setError('Failed to save token');
                }
              } catch (e) {
                // console.log(e);
                if (e instanceof AxiosError) {
                  setError(e.response?.data.message);
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
              <Form onSubmit={handleSubmit}>
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
              </Form>
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
